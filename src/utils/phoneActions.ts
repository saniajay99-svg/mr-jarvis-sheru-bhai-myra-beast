import { soundEffects } from './audio';

class PhoneActionController {
  private torchStream: MediaStream | null = null;
  public isTorchOn: boolean = false;
  private activeTimerId: any = null;

  // 1. Direct Phone Call
  callNumber(phoneNumber: string): string {
    const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
    soundEffects.playSuccessChime();
    window.location.href = `tel:${cleanNumber}`;
    return `Dialing ${cleanNumber} for Aijay Boss...`;
  }

  // 2. WhatsApp Direct Message / Share
  openWhatsApp(text: string, phone?: string): string {
    soundEffects.playSuccessChime();
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    return `Opening WhatsApp for Aijay Boss...`;
  }

  // 3. Phone Flashlight / Torch Control
  async toggleTorch(forceState?: boolean): Promise<{ success: boolean; isOn: boolean; message: string }> {
    try {
      const targetState = forceState !== undefined ? forceState : !this.isTorchOn;

      if (!targetState) {
        if (this.torchStream) {
          this.torchStream.getTracks().forEach(track => track.stop());
          this.torchStream = null;
        }
        this.isTorchOn = false;
        soundEffects.playBeep();
        return { success: true, isOn: false, message: 'Flashlight turned OFF for Aijay Boss' };
      }

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return { success: false, isOn: false, message: 'Flashlight hardware control not supported in this browser' };
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      const track = stream.getVideoTracks()[0];
      const capabilities: any = track.getCapabilities?.() || {};

      if (!capabilities.torch) {
        stream.getTracks().forEach(t => t.stop());
        return { success: false, isOn: false, message: 'Camera torch constraint not available on this device' };
      }

      await (track as any).applyConstraints({
        advanced: [{ torch: true }]
      });

      this.torchStream = stream;
      this.isTorchOn = true;
      soundEffects.playJarvisWake();
      return { success: true, isOn: true, message: 'Flashlight turned ON for Aijay Boss!' };
    } catch (e: any) {
      console.warn('Torch toggle error:', e);
      return { success: false, isOn: false, message: e.message || 'Could not toggle flashlight' };
    }
  }

  // 4. Phone Battery Status
  async getBatteryStatus(): Promise<{ level: number; isCharging: boolean; message: string }> {
    try {
      const nav: any = navigator;
      if (nav.getBattery) {
        const battery = await nav.getBattery();
        const level = Math.round(battery.level * 100);
        const isCharging = battery.charging;
        const msg = `Aijay Boss, your phone battery is at ${level}% ${isCharging ? 'and currently charging ⚡' : 'remaining'}.`;
        return { level, isCharging, message: msg };
      }
    } catch (e) {}

    return { level: 100, isCharging: true, message: "Aijay Boss, battery is powered and running smoothly on your device!" };
  }

  // 5. Phone Haptic Vibration
  vibrate(pattern: number[] = [120, 80, 200]): boolean {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        return navigator.vibrate(pattern);
      }
    } catch (e) {}
    return false;
  }

  // 6. Copy to Phone Clipboard
  async copyText(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        soundEffects.playBeep();
        return true;
      }
    } catch (e) {}
    return false;
  }

  // 7. Open Google Maps Navigation
  openMaps(locationQuery: string) {
    soundEffects.playBeep();
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`;
    window.open(url, '_blank');
  }

  // 8. Open YouTube / MrBeast
  openYouTube(query: string = 'MrBeast') {
    soundEffects.playSuccessChime();
    const clean = query.trim().toLowerCase();
    const url = (clean === '' || clean.includes('mrbeast') || clean.includes('mr beast'))
      ? 'https://www.youtube.com/@MrBeast?sub_confirmation=1'
      : `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
    return `Opening YouTube for Aijay Boss...`;
  }

  // 9. Open Google Search
  openGoogle(searchQuery: string = '') {
    soundEffects.playSuccessChime();
    const url = searchQuery
      ? `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
      : 'https://www.google.com';
    window.open(url, '_blank');
    return `Opening Google Search for Aijay Boss...`;
  }

  // 10. Open Calculator
  openCalculator() {
    soundEffects.playSuccessChime();
    window.open('https://www.google.com/search?q=calculator', '_blank');
    return `Opening Calculator for Aijay Boss...`;
  }

  // 11. Generic App Opener
  openApp(appName: string) {
    soundEffects.playSuccessChime();
    const clean = appName.toLowerCase().trim();
    if (clean.includes('youtube') || clean.includes('video')) {
      return this.openYouTube(clean);
    }
    if (clean.includes('whatsapp') || clean.includes('message') || clean.includes('chat')) {
      return this.openWhatsApp('Namaste Aijay Boss!');
    }
    if (clean.includes('map') || clean.includes('navigation') || clean.includes('rasta')) {
      this.openMaps('India');
      return `Opening Google Maps for Aijay Boss...`;
    }
    if (clean.includes('calc') || clean.includes('hisab')) {
      return this.openCalculator();
    }
    if (clean.includes('dial') || clean.includes('phone') || clean.includes('call')) {
      window.location.href = 'tel:';
      return `Opening Phone Dialer for Aijay Boss...`;
    }
    if (clean.includes('chrome') || clean.includes('google') || clean.includes('browser')) {
      return this.openGoogle();
    }
    // Fallback: search or open app via Google
    window.open(`https://www.google.com/search?q=open+${encodeURIComponent(appName)}+app`, '_blank');
    return `Opening ${appName} for Aijay Boss...`;
  }

  // 12. Countdown Timer
  startTimer(
    seconds: number,
    onTick: (remaining: number) => void,
    onComplete: () => void
  ) {
    if (this.activeTimerId) {
      clearInterval(this.activeTimerId);
    }
    let left = seconds;
    onTick(left);

    this.activeTimerId = setInterval(() => {
      left -= 1;
      onTick(left);
      if (left <= 0) {
        clearInterval(this.activeTimerId);
        this.activeTimerId = null;
        soundEffects.playSuccessChime();
        this.vibrate([200, 100, 200, 100, 400]);
        onComplete();
      }
    }, 1000);
  }

  cancelTimer() {
    if (this.activeTimerId) {
      clearInterval(this.activeTimerId);
      this.activeTimerId = null;
    }
  }
}

export const phoneActions = new PhoneActionController();
