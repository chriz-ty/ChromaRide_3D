class ColorDetector {
    constructor() {
        // Create container for webcam and overlay
        this.container = document.createElement('div');
        this.container.style.position = 'fixed';
        this.container.style.bottom = '20px';
        this.container.style.right = '20px';
        this.container.style.width = '240px';  // Reduced from 400px
        this.container.style.height = '180px'; // Reduced from 300px
        this.container.style.borderRadius = '8px';
        this.container.style.overflow = 'hidden';
        this.container.style.border = '2px solid #333';
        
        // Video element
        this.video = document.createElement('video');
        this.video.style.width = '100%';
        this.video.style.height = '100%';
        this.video.style.transform = 'scaleX(-1)';
        this.video.style.objectFit = 'cover';
        
        // Canvas for processing
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Create detection box overlay - made smaller
        this.overlay = document.createElement('div');
        this.overlay.style.position = 'absolute';
        this.overlay.style.top = '50%';
        this.overlay.style.left = '50%';
        this.overlay.style.transform = 'translate(-50%, -50%)';
        this.overlay.style.width = '80px';    // Reduced from 120px
        this.overlay.style.height = '80px';   // Reduced from 120px
        this.overlay.style.border = '3px solid #00ff00';
        this.overlay.style.boxSizing = 'border-box';
        
        // Create color display - adjusted size
        this.colorDisplay = document.createElement('div');
        this.colorDisplay.style.position = 'absolute';
        this.colorDisplay.style.bottom = '8px';
        this.colorDisplay.style.left = '8px';
        this.colorDisplay.style.padding = '6px';
        this.colorDisplay.style.background = 'rgba(0,0,0,0.7)';
        this.colorDisplay.style.color = 'white';
        this.colorDisplay.style.borderRadius = '4px';
        this.colorDisplay.style.fontSize = '12px';
        this.colorDisplay.style.fontFamily = 'Arial, sans-serif';
        
        // Create color preview box - made smaller
        this.colorPreview = document.createElement('div');
        this.colorPreview.style.position = 'absolute';
        this.colorPreview.style.top = '8px';
        this.colorPreview.style.right = '8px';
        this.colorPreview.style.width = '30px';   // Reduced from 50px
        this.colorPreview.style.height = '30px';  // Reduced from 50px
        this.colorPreview.style.borderRadius = '6px';
        this.colorPreview.style.border = '2px solid white';
        
        // Add elements to container
        this.container.appendChild(this.video);
        this.container.appendChild(this.overlay);
        this.container.appendChild(this.colorDisplay);
        this.container.appendChild(this.colorPreview);
        document.body.appendChild(this.container);

        // Store previous colors for smoothing
        this.previousColors = [];
        this.maxPreviousColors = 5;
    }

    async initialize() {
        if (!window.cv) {
            await new Promise(resolve => {
                document.addEventListener('opencv-ready', resolve, { once: true });
            });
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: 'user'
                } 
            });
            this.video.srcObject = stream;
            await new Promise(resolve => {
                this.video.onloadedmetadata = resolve;
            });
            await this.video.play();

            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;

            return true;
        } catch (error) {
            console.error('Error initializing webcam:', error);
            return false;
        }
    }

    getDominantColor() {
        try {
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            
            // Get the center region (where the green box is)
            const centerSize = 120;
            const x = (this.canvas.width - centerSize) / 2;
            const y = (this.canvas.height - centerSize) / 2;
            const imageData = this.ctx.getImageData(x, y, centerSize, centerSize);
            
            // Convert to OpenCV format
            const src = cv.matFromImageData(imageData);
            const dst = new cv.Mat();
            
            // Apply slight blur to reduce noise
            cv.GaussianBlur(src, src, new cv.Size(5, 5), 0, 0);
            
            // Convert to HSV color space
            cv.cvtColor(src, dst, cv.COLOR_RGBA2RGB);
            cv.cvtColor(dst, dst, cv.COLOR_RGB2HSV);
            
            // Calculate mean color
            const mean = cv.mean(dst);
            
            // Convert HSV back to RGB
            const color = this.hsvToRgb(mean[0], mean[1] / 255, mean[2] / 255);
            
            // Add to previous colors and get smoothed color
            this.previousColors.push(color);
            if (this.previousColors.length > this.maxPreviousColors) {
                this.previousColors.shift();
            }
            
            const smoothedColor = this.smoothColors(this.previousColors);
            
            // Update displays
            this.updateDisplays(smoothedColor);
            
            // Clean up
            src.delete();
            dst.delete();
            
            return smoothedColor;
        } catch (error) {
            console.error('Error in color detection:', error);
            return { r: 255, g: 255, b: 255 };
        }
    }

    smoothColors(colors) {
        const sum = colors.reduce((acc, color) => ({
            r: acc.r + color.r,
            g: acc.g + color.g,
            b: acc.b + color.b
        }), { r: 0, g: 0, b: 0 });

        return {
            r: Math.round(sum.r / colors.length),
            g: Math.round(sum.g / colors.length),
            b: Math.round(sum.b / colors.length)
        };
    }

    updateDisplays(color) {
        // Update color display text
        this.colorDisplay.textContent = `R: ${color.r} G: ${color.g} B: ${color.b}`;
        this.colorDisplay.style.color = this.isColorLight(color) ? 'black' : 'white';
        
        // Update color preview box
        this.colorPreview.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
        
        // Add hex value to display
        const hex = this.rgbToHex(color);
        this.colorDisplay.textContent += `\nHEX: ${hex}`;
    }

    rgbToHex(color) {
        const toHex = (n) => {
            const hex = n.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`.toUpperCase();
    }

    isColorLight(color) {
        return (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) > 128;
    }

    hsvToRgb(h, s, v) {
        h = h / 180; // OpenCV uses 0-180 for hue
        let r, g, b;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
}

export { ColorDetector }; 