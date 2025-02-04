import RefreshRuntime from "/@react-refresh";

if (!import.meta.env || !import.meta.env.PROD) {
	RefreshRuntime.injectIntoGlobalHook(window);
	window.$RefreshReg$ = () => {};
	window.$RefreshSig$ = () => (type) => type;
	window.__vite_plugin_react_preamble_installed__ = true;
}
