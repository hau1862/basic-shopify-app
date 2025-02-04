import { useCallback } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes as ReactRouterRoutes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "react-query";
import { NavMenu } from "@shopify/app-bridge-react";
import { AppProvider } from "@shopify/polaris";
import { initI18n, getPolarisTranslations } from "./utilities";
import "@shopify/polaris/build/esm/styles.css";

function AppBridgeLink({ url, children, external, ...rest }) {
	const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

	const handleClick = useCallback(function () {
		window.open(url, "_self");
	}, [url]);

	if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
		return <a {...rest} href={url} target="_blank" rel="noopener noreferrer">{children}</a>;
	} else {
		return <a {...rest} onClick={handleClick}>{children}</a>;
	}
}

/**
 * Sets up the AppProvider from Polaris.
 * @desc PolarisProvider passes a custom link component to Polaris.
 * The Link component handles navigation within an embedded app.
 * Prefer using this vs any other method such as an anchor.
 * Use it by importing Link from Polaris, e.g:
 *
 * ```
 * import {Link} from '@shopify/polaris'
 *
 * function MyComponent() {
 *  return (
 *    <div><Link url="/tab2">Tab 2</Link></div>
 *  )
 * }
 * ```
 *
 * PolarisProvider also passes translations to Polaris.
 *
 */
// function PolarisProvider({ children }) {
// 	const translations = getPolarisTranslations();

// 	return (
// 		<AppProvider i18n={translations} linkComponent={AppBridgeLink}>
// 			{children}
// 		</AppProvider>
// 	);
// }

/**
 * Sets up the QueryClientProvider from react-query.
 * @desc See: https://react-query.tanstack.com/reference/QueryClientProvider#_top
 */
// function QueryProvider({ children }) {
// 	const client = new QueryClient({
// 		queryCache: new QueryCache(),
// 		mutationCache: new MutationCache()
// 	});

// 	return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
// }

function useRoutes(pages) {
	const routes = Object.keys(pages)
		.map((key) => {
			let path = key
				.replace("./pages", "")
				.replace(/\.(t|j)sx?$/, "")
				/**
				 * Replace /index with /
				 */
				.replace(/\/index$/i, "/")
				/**
				 * Only lowercase the first letter. This allows the developer to use camelCase
				 * dynamic paths while ensuring their standard routes are normalized to lowercase.
				 */
				.replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
				/**
				 * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
				 */
				.replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param) => `:${param}`);

			if (path.endsWith("/") && path !== "/") {
				path = path.substring(0, path.length - 1);
			}

			if (!pages[key].default) {
				console.warn(`${key} doesn't export a default React component`);
			}

			return {
				path,
				component: pages[key].default
			};
		})
		.filter((route) => route.component);

	return routes;
}

/**
 * File-based routing.
 * @desc File-based routing that uses React Router under the hood.
 * To create a new route create a new .jsx file in `/pages` with a default export.
 *
 * Some examples:
 * * `/pages/index.jsx` matches `/`
 * * `/pages/blog/[id].jsx` matches `/blog/123`
 * * `/pages/[...catchAll].jsx` matches any URL not explicitly matched
 *
 * @param {object} pages value of import.meta.glob(). See https://vitejs.dev/guide/features.html#glob-import
 *
 * @return {Routes} `<Routes/>` from React Router, with a `<Route/>` for each file in `pages`
 */
function Routes({ pages }) {
	const routes = useRoutes(pages);
	const routeComponents = routes.map(({ path, component: Component }) => <Route key={path} path={path} element={<Component />} />);

	const NotFound = routes.find(({ path }) => path === "/not-found").component;

	return (
		<ReactRouterRoutes>
			{routeComponents}
			<Route path="*" element={<NotFound />} />
		</ReactRouterRoutes>
	);
}

function App() {
	// Any .tsx or .jsx files in /pages will become a route
	// See documentation for <Routes /> for more info
	const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", { eager: true });
	const client = new QueryClient({ queryCache: new QueryCache(), mutationCache: new MutationCache() });
	const translations = getPolarisTranslations();
	const { t } = useTranslation();

	return (
		<AppProvider i18n={translations} linkComponent={AppBridgeLink}>
			<BrowserRouter>
				<QueryClientProvider client={client}>
					<NavMenu>
						<a href="/" rel="home" />
						<a href="/pagename">{t("NavigationMenu.pageName")}</a>
					</NavMenu>
					<Routes pages={pages} />
				</QueryClientProvider>
			</BrowserRouter>
		</AppProvider>
	);
}

// Ensure that locales are loaded before rendering the app
initI18n().then(() => {
	const root = createRoot(document.getElementById("app"));
	root.render(<App />);
});
