package com.aijayboss.mrjarvisbeast;

import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleIncomingIntent(getIntent());
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIncomingIntent(intent);
    }

    private void handleIncomingIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        Log.d(TAG, "Incoming Intent action: " + action);

        if (Intent.ACTION_ASSIST.equals(action) || "android.intent.action.VOICE_COMMAND".equals(action)) {
            Log.i(TAG, "Mr Jarvis Beast invoked as Default System Digital Assistant for Master Aijay Boss!");
        }
    }

    /**
     * Helper to open Android System Settings to set Mr Jarvis Beast as Default Assistant App
     */
    public void openDefaultAssistantSettings() {
        Intent intent = new Intent(Settings.ACTION_VOICE_INPUT_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
    }
}
