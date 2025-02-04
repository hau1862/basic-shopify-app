import PropTypes from "prop-types";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Banner, Text, Button } from "@shopify/polaris";
import { AllModuleData } from "@/constants";

export function EnableModuleBanner({ moduleId = 1, dirty = false }) {
	const navigate = useNavigate();
	const shopify = useAppBridge();
	const { t } = useTranslation();

	const handleConfigurationClick = useCallback(function () {
		dirty ? shopify.saveBar.leaveConfirmation() : navigate("/configurations");
	}, [dirty]);

	return (
		<Banner tone="warning">
			<Text as="span" variant="headingSm">{AllModuleData[moduleId].name}</Text>
			<Text as="span">{t(" is disabled on your storefront. To make it work, please Enable it on ")}</Text>
			<Button variant="plain" onClick={handleConfigurationClick}>{t("Configurations")}</Button>
		</Banner>
	);
}

EnableModuleBanner.propTypes = {
	moduleId: PropTypes.number,
	dirty: PropTypes.bool
}
