import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
	adapter: adapter({
	    pages: "docs",
	    assets: "docs",
	    fallback: '404.html'
	}),
	paths: {
	    // setting path base for github pages deployment
	    base: process.env.NODE_ENV === 'production' ? '/wikoSB' : '',
        }
    }
};

// config.paths = { base: process.argv.includes('dev') ? '' : process.env.BASE_PATH };

export default config;
