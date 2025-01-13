export class SpriteLoader {
    constructor() {
        this.sprites = new Map();
    }

    async loadSprite(spritePath) {
        if (this.sprites.has(spritePath)) {
            return this.sprites.get(spritePath);
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                console.log('Sprite loaded successfully:', spritePath);
                this.sprites.set(spritePath, img);
                resolve(img);
            };
            img.onerror = (e) => {
                console.error('Failed to load sprite:', spritePath, e);
                reject(new Error(`Failed to load sprite: ${spritePath}`));
            };
            console.log('Attempting to load sprite:', spritePath);
            img.src = spritePath;
        });
    }

    async loadSprites(spritePaths) {
        try {
            const loadedImages = await Promise.all(
                spritePaths.map(path => this.loadSprite(path))
            );
            return loadedImages;
        } catch (error) {
            console.error('Error loading sprites:', error);
            return [];
        }
    }
}
