package com.aijayboss.mrjarvisbeast;

import android.app.assist.AssistContent;
import android.app.assist.AssistStructure;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.service.voice.VoiceInteractionSession;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * System Voice Interaction Session for Mr Jarvis Beast.
 * Handles on-screen context, screenshot capturing for multimodal vision,
 * and displays the assistant overlay or routes to the main app.
 */
public class JarvisVoiceSession extends VoiceInteractionSession {
    private static final String TAG = "JarvisVoiceSession";

    public JarvisVoiceSession(Context context) {
        super(context);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        // Request on-screen context and screenshot for vision intelligence
        setUiEnabled(true);
    }

    @Override
    public View onCreateContentView() {
        Context context = getContext();

        // Root container with dark royal gradient overlay (#07090E)
        FrameLayout rootLayout = new FrameLayout(context);
        rootLayout.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        rootLayout.setBackgroundColor(Color.parseColor("#9907090E"));

        // Royal Bottom Sheet HUD Card
        LinearLayout card = new LinearLayout(context);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setPadding(48, 48, 48, 48);

        GradientDrawable cardBg = new GradientDrawable();
        cardBg.setColor(Color.parseColor("#F20B101F"));
        cardBg.setCornerRadii(new float[]{40, 40, 40, 40, 0, 0, 0, 0});
        cardBg.setStroke(3, Color.parseColor("#E6F59E0B")); // Amber Gold Border
        card.setBackground(cardBg);

        FrameLayout.LayoutParams cardParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                Gravity.BOTTOM
        );
        card.setLayoutParams(cardParams);

        // Assistant Title
        TextView title = new TextView(context);
        title.setText("👑 MR JARVIS BEAST • MASTER AI ASSISTANT");
        title.setTextColor(Color.parseColor("#FDE047")); // Yellow-gold
        title.setTextSize(16);
        title.setTypeface(null, android.graphics.Typeface.BOLD);
        title.setGravity(Gravity.CENTER);
        card.addView(title);

        // Subtitle / Prompt
        TextView subtitle = new TextView(context);
        subtitle.setText("Listening for Master Aijay Boss... (VIVO V17 Optimized)");
        subtitle.setTextColor(Color.parseColor("#94A3B8"));
        subtitle.setTextSize(12);
        subtitle.setGravity(Gravity.CENTER);
        subtitle.setPadding(0, 12, 0, 24);
        card.addView(subtitle);

        // Tap to open full Jarvis Beast App button
        TextView openBtn = new TextView(context);
        openBtn.setText("🚀 OPEN FULL JARVIS BEAST STUDIO");
        openBtn.setTextColor(Color.parseColor("#07090E"));
        openBtn.setTextSize(13);
        openBtn.setTypeface(null, android.graphics.Typeface.BOLD);
        openBtn.setGravity(Gravity.CENTER);
        openBtn.setPadding(24, 20, 24, 20);

        GradientDrawable btnBg = new GradientDrawable();
        btnBg.setColor(Color.parseColor("#FBBF24")); // Amber gold
        btnBg.setCornerRadius(24);
        openBtn.setBackground(btnBg);
        openBtn.setOnClickListener(v -> launchFullJarvisApp());
        card.addView(openBtn);

        rootLayout.addView(card);
        rootLayout.setOnClickListener(v -> finish());

        return rootLayout;
    }

    @Override
    public void onShow(Bundle args, int showFlags) {
        super.onShow(args, showFlags);
        Log.d(TAG, "JarvisVoiceSession shown with flags: " + showFlags);
    }

    @Override
    public void onHandleAssist(Bundle data, AssistStructure structure, AssistContent content) {
        super.onHandleAssist(data, structure, content);
        Log.d(TAG, "Received AssistStructure from foreground application");
        // Extracted text, bundle data, and web intent can be passed to Jarvis reasoning core
    }

    @Override
    public void onHandleScreenshot(Bitmap screenshot) {
        super.onHandleScreenshot(screenshot);
        if (screenshot != null) {
            Log.d(TAG, "Captured on-screen screenshot (" + screenshot.getWidth() + "x" + screenshot.getHeight() + ") for Jarvis Live Vision reasoning");
        }
    }

    private void launchFullJarvisApp() {
        Intent intent = new Intent(getContext(), MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        intent.putExtra("ASSIST_TRIGGERED", true);
        getContext().startActivity(intent);
        finish();
    }
}
