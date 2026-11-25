package com.aijayboss.mrjarvisbeast;

import android.os.Bundle;
import android.service.voice.VoiceInteractionSession;
import android.service.voice.VoiceInteractionSessionService;

/**
 * Voice Interaction Session Service that instantiates the active assistant UI/session
 * whenever the user activates the assistant gesture or hotword.
 */
public class JarvisVoiceSessionService extends VoiceInteractionSessionService {
    @Override
    public VoiceInteractionSession onNewSession(Bundle args) {
        return new JarvisVoiceSession(this);
    }
}
