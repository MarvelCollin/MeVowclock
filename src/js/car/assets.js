class Assets {
    static instance = null;
    static assets = null;

    constructor() {
        if (Assets.instance) {
            return Assets.instance;
        }
        Assets.instance = this;
    }

    async fetchAssets() {
        if (Assets.assets) {
            return Assets.assets;
        }
        const response = await fetch('../assets/assets.json');
        if (!response.ok) {
            throw new Error('Waduh error nih: ' + response.statusText);
        }
        Assets.assets = await response.json();
        return Assets.assets;
    }

        async getCatSleep() {
            try {
                const assets = await this.fetchAssets();
                return assets.CAT.SLEEP;
            } catch (error) {
                console.error('Error in getCatSleep:', error);
                return null;
            }
        }

        async getCatIdle() {
            try {
                const assets = await this.fetchAssets();
                return assets.CAT.IDLE;
            } catch (error) {
                console.error('Error in getCatIdle:', error);
                return null;
            }
        }

        async getCatRun() {
            try {
                const assets = await this.fetchAssets();
                return assets.CAT.RUN;
            } catch (error) {
                console.error('Error in getCatRun:', error);
                return null;
            }
        }

        async getCatWalk() {
            try {
                const assets = await this.fetchAssets();
                return assets.CAT.WALK;
            } catch (error) {
                console.error('Error in getCatWalk:', error);
                return null;
            }
        }

}

const assetsInstance = new Assets();
export default assetsInstance;
