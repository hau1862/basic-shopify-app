import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Banner, List, Box, Button, Text } from "@shopify/polaris";
import { updateShowInfoBanner } from "@/redux/actions/general";
import { getShopConfig } from "@/redux/actions/configurations";
import { handleChangeShowInfoBanner } from "@/redux/slices/general";
import { AllModuleData, AllTogglePageData } from "@/constants";

export function SetupModuleBanner({ moduleId = 1, dirty = false }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const shopify = useAppBridge();
	const { t } = useTranslation();

	const handleBannerDismiss = useCallback(
		function () {
			const bannerKey = AllModuleData[moduleId].code + "_steps";
			dispatch(handleChangeShowInfoBanner({ [bannerKey]: false }));
			updateShowInfoBanner(user.domain, { ...isShowInfoBanner, [bannerKey]: false });
		},
		[moduleId, user.domain, isShowInfoBanner]
	);

	const handleConfigurationClick = useCallback(
		function () {
			dirty ? shopify.saveBar.leaveConfirmation() : navigate("/configurations");
		},
		[moduleId, dirty]
	);

	const handleInstallationClick = useCallback(
		function () {
			dirty ? shopify.saveBar.leaveConfirmation() : navigate("/installations");
		},
		[moduleId, dirty]
	);

	useEffect(
		function () {
			getShopConfig(user.domain, dispatch);
		},
		[user.domain]
	);

	const bannerShow = useMemo(
		function () {
			const bannerKey = AllModuleData[moduleId].code + "_steps";
			return isShowInfoBanner[bannerKey];
		},
		[moduleId, isShowInfoBanner]
	);

	const proxyLink = useMemo(
		function () {
			const proxyPath = SetupDataMapping[moduleId].proxy;
			return is_enable_embed_proxy ? `https://${user.domain}/account?portal=/${proxyPath}` : `https://${user.domain}/apps/customer-portal/${proxyPath}`;
		},
		[moduleId, user.domain, is_enable_embed_proxy]
	);

	const wikiLink = useMemo(
		function () {
			const wikiPath = SetupDataMapping[moduleId].wiki;
			return `${WIKI_BCP_LINK}/${wikiPath}`;
		},
		[moduleId]
	);

	return bannerShow ? (
		<Banner title={t(`Follow these steps to use ${AllModuleData[moduleId].name}:`)} tone="info" onDismiss={handleBannerDismiss}>
			<List type="number">
				<List.Item>
					<Text as="span">{t(`Enable ${AllModuleData[moduleId].name} on `)}</Text>
					<Button onClick={handleConfigurationClick} variant="plain">
						{t("Configurations")}
					</Button>
				</List.Item>
				<List.Item>{t(`Create ${AllModuleData[moduleId].name} rule`)}</List.Item>
				<List.Item>
					<Button onClick={handleInstallationClick} variant="plain">
						{t("Install")}
					</Button>
					<Text as="span">{t(AllModuleData[moduleId].name + " button to your theme")}</Text>
				</List.Item>
				<List.Item>
					<Text as="span">{t("Check on ")}</Text>
					<Button url={proxyLink} external={true} variant="plain">{`${AllModuleData[moduleId].name} Proxy Link`}</Button>
				</List.Item>
			</List>
			<Box paddingInline="300">
				<Text as="span">{t("Please refer to the ")}</Text>
				<Button url={wikiLink} external={true} variant="plain">
					{t("User Guide")}
				</Button>
				<Text as="span">{t(" on how to use our feature")}</Text>
			</Box>
		</Banner>
	) : null;
}

SetupModuleBanner.propTypes = {
	moduleId: PropTypes.number,
	dirty: PropTypes.bool
};
