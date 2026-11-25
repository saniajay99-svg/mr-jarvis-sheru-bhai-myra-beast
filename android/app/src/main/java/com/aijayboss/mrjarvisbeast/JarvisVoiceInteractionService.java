package com.aijayboss.mrjarvisbeast;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.service.voice.VoiceInteractionService;
import android.service.voice.VoiceInteractionSession;
import android.util.Log;

/**
 * System-level Voice Interaction Service for Mr Jarvis Beast (com.aijayboss.mrjarvisbeast)
 * Dedicated personal AI assistant for Master Aijay Boss.
 * Handles system-level voice trigger, home button hold, and assistant invocations.
 */
public class JarvisVoiceInteractionService extends VoiceInteractionService {
    private static final String TAG = "JarvisVoiceService";

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "JarvisVoiceInteractionService created for Master Aijay Boss");
    }

    @Override
    public void onReady() {
        super.onReady();
        Log.d(TAG, "JarvisVoiceInteractionService is ready and active");

        // Verify if Mr Jarvis Beast is currently set as the active voice interaction service
        boolean isActive = isActiveService(this, new ComponentName(this, JarvisVoiceInteractionService.class));
        Log.i(TAG, "Mr Jarvis Beast is currently default assistant: " + isActive);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && "TRIGGER_ASSIST".equals(intent.getAction())) {
            Bundle args = new Bundle();
            args.putString("TRIGGER_SOURCE", "MANUAL_OR_HOTWORD");
            showSession(args, VoiceInteractionSession.SHOW_SOURCE_ASSIST_GESTURE);
        }
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onShutdown() {
        super.onShutdown();
        Log.d(TAG, "JarvisVoiceInteractionService shut down");
    }
}
