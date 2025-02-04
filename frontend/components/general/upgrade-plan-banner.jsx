import PropTypes from "prop-types";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Banner, Text, Button } from "@shopify/polaris";
import { AllModuleData, AllPlanData } from "@/constants";

export function UpgradePlanBanner({ moduleId = 1, dirty = false }) {
	const navigate = useNavigate();
	const shopify = useAppBridge();
	const { t } = useTranslation();

	const handleUpgradePlanClick = useCallback(function () {
		dirty ? shopify.saveBar.leaveConfirmation() : navigate("/plans");
	}, [dirty]);

	return (
		<Banner tone="warning">
			<Text as="span" variant="headingSm">{AllModuleData[moduleId].name}</Text>
			<Text as="span">{t(" is unavailable now. To use it, please Upgrade your plan to ")}</Text>
			<Button variant="plain" onClick={handleUpgradePlanClick}>{AllPlanData[requiredPlanId].name}</Button>
		</Banner>
	);
}

UpgradePlanBanner.propTypes = {
	moduleId: PropTypes.number,
	dirty: PropTypes.bool
};
