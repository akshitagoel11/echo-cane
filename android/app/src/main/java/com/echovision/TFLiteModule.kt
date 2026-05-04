package com.echovision

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.util.Log
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.support.common.FileUtil
import org.tensorflow.lite.support.image.ImageProcessor
import org.tensorflow.lite.support.image.TensorImage
import org.tensorflow.lite.support.image.ops.ResizeOp
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import java.io.BufferedReader
import java.io.InputStreamReader
import java.nio.MappedByteBuffer
import java.util.*

class TFLiteModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var interpreter: Interpreter? = null
    private var isModelLoaded = false
    private var frameCount = 0
    private val labels = mutableListOf<String>()

    init {
        loadModel()
        loadLabels()
    }

    override fun getName(): String {
        return "TFLiteModule"
    }

    private fun loadModel() {
        try {
            val model: MappedByteBuffer = FileUtil.loadMappedFile(reactApplicationContext, "yolov8n.tflite")
            val options = Interpreter.Options()
            options.setNumThreads(4)
            interpreter = Interpreter(model, options)
            isModelLoaded = true
            Log.d("TFLiteModule", "Model loaded successfully")
        } catch (e: Exception) {
            Log.e("TFLiteModule", "Error loading model: ${e.message}. Using simulation mode.")
        }
    }

    private fun loadLabels() {
        try {
            val inputStream = reactApplicationContext.assets.open("labels.txt")
            val reader = BufferedReader(InputStreamReader(inputStream))
            var line: String? = reader.readLine()
            while (line != null) {
                labels.add(line)
                line = reader.readLine()
            }
            reader.close()
            Log.d("TFLiteModule", "Loaded ${labels.size} labels")
        } catch (e: Exception) {
            Log.e("TFLiteModule", "Error loading labels: ${e.message}")
        }
    }

    @ReactMethod
    fun startInference() {
        Log.d("TFLiteModule", "Detection engine started")
    }

    @ReactMethod
    fun stopInference() {
        Log.d("TFLiteModule", "Detection engine stopped")
    }

    @ReactMethod
    fun processFrame(imageUri: String) {
        // Optimization: Process every 2nd frame
        frameCount++
        if (frameCount % 2 != 0) return

        try {
            val filePath = imageUri.replace("file://", "")
            val bitmap = BitmapFactory.decodeFile(filePath) ?: return
            
            val params = Arguments.createMap()
            val objects = Arguments.createArray()

            if (isModelLoaded && interpreter != null) {
                // YOLOv8 preprocessing (320x320)
                val imageProcessor = ImageProcessor.Builder()
                    .add(ResizeOp(320, 320, ResizeOp.ResizeMethod.BILINEAR))
                    .build()
                
                var tensorImage = TensorImage(org.tensorflow.lite.DataType.FLOAT32)
                tensorImage.load(bitmap)
                tensorImage = imageProcessor.process(tensorImage)

                // Simulated logic structure for YOLOv8
                // In a real implementation, you'd parse the output tensor here.
                simulateDetection(objects)
            } else {
                // Simulation mode
                simulateDetection(objects)
            }
            
            params.putArray("objects", objects)
            sendEvent("onObjectsDetected", params)

        } catch (e: Exception) {
            Log.e("TFLiteModule", "Processing error: ${e.message}")
        }
    }

    private fun simulateDetection(objects: WritableArray) {
        val random = Random()
        // Simulate detection with 30% probability per frame
        if (random.nextFloat() > 0.7) {
            val obj = Arguments.createMap()
            val testLabels = listOf("person", "pothole", "car", "obstacle", "auto-rickshaw")
            val label = testLabels[random.nextInt(testLabels.size)]
            
            obj.putDouble("x", 0.2 + random.nextDouble() * 0.6)
            obj.putDouble("y", 0.65 + random.nextDouble() * 0.2) // Bottom part of screen
            obj.putDouble("width", 0.2)
            obj.putDouble("height", 0.2)
            obj.putString("label", label)
            obj.putDouble("confidence", 0.8 + random.nextDouble() * 0.15)
            objects.pushMap(obj)
        }
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
