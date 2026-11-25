package com.aijayboss.mrjarvisbeast;

import android.content.Intent;
import android.os.Bundle;
import android.speech.RecognitionService;
import android.util.Log;

import java.util.ArrayList;

/**
 * System-level Recognition Service for Mr Jarvis Beast.
 * Required to register as the default voice recognition provider alongside VoiceInteractionService.
 */
public class JarvisRecognitionService extends RecognitionService {
    private static final String TAG = "JarvisRecognition";

    @Override
    protected void onStartListening(Intent recognizerIntent, Callback listener) {
        Log.d(TAG, "onStartListening called");
        try {
            listener.readyForSpeech(new Bundle());
        } catch (Exception e) {
            Log.e(TAG, "Error notifying readyForSpeech", e);
        }
    }

    @Override
    protected void onCancel(Callback listener) {
        Log.d(TAG, "onCancel speech listening");
    }

    @Override
    protected void onStopListening(Callback listener) {
        Log.d(TAG, "onStopListening speech listening");
        try {
            Bundle results = new Bundle();
            ArrayList<String> matches = new ArrayList<>();
            matches.add("Jarvis Beast active");
            results.putStringArrayList(android.speech.SpeechRecognizer.RESULTS_RECOGNITION, matches);
            listener.results(results);
        } catch (Exception e) {
            Log.e(TAG, "Error posting speech results", e);
        }
    }
}
