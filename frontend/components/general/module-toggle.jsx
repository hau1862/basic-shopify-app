import PropTypes from "prop-types";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Card, Text, Box, InlineStack, Icon, Button } from "@shopify/polaris";
import { CalendarTimeIcon, OrderIcon, ProfileIcon, SearchListIcon, WorkIcon } from "@shopify/polaris-icons";
import { Switch } from "@/components/common";
import { AllModuleData, AllPlanData } from "@/constants";

const ModuleIconMapping = Object.freeze({ 0: SearchListIcon, 1: CalendarTimeIcon, 2: OrderIcon, 3: WorkIcon, 4: ProfileIcon });

export function ModuleToggle({ moduleId = 1, status = false, loading = false, dirty = false, onChange = () => {} }) {
	const navigate = useNavigate();
	const shopify = useAppBridge();
	const { t } = useTranslation();
	const { allModuleStatusData } = useSelector((state) => state.general.user);
	const { allowToUse, requiredPlanId } = allModuleStatusData[moduleId];

	const handleStatusChange = useCallback(
		function () {
			onChange(!status);
		},
		[status]
	);

	const handleConfigureModuleClick = useCallback(
		function () {
			const moduleCode = AllModuleData[moduleId].code;
			dirty ? shopify.saveBar.leaveConfirmation() : navigate(`/${moduleCode}`);
		},
		[moduleId, dirty]
	);

	const handleUpgradePlanClick = useCallback(
		function () {
			dirty ? shopify.saveBar.leaveConfirmation() : navigate("/plan");
		},
		[dirty]
	);

	return (
		<Card>
			<InlineStack align="space-between" blockAlign="center">
				<InlineStack gap="100" blockAlign="center">
					<Icon source={ModuleIconMapping[moduleId]} tone="base" />
					<Text as="h3" variant="headingMd">
						{AllModuleData[moduleId].name}
					</Text>
				</InlineStack>
				{allowToUse ? (
					<Switch status={status} loading={loading} onChange={handleStatusChange} />
				) : (
					<Button onClick={handleUpgradePlanClick} variant="plain">
						<Text as="span">{t("Available on ")}</Text>
						<Text as="span" variant="headingSm">
							{AllPlanData[requiredPlanId].name}
						</Text>
					</Button>
				)}
			</InlineStack>
			<Box paddingBlock="300" paddingInline="200">
				<Box minHeight="40px">{t(AllModuleData[moduleId].description)}</Box>
			</Box>
			<Box paddingInline="200">
				<Button onClick={handleConfigureModuleClick} size="large">
					{t("Configure")}
				</Button>
			</Box>
		</Card>
	);
}

ModuleToggle.propTypes = {
	moduleId: PropTypes.number,
	status: PropTypes.bool,
	loading: PropTypes.bool,
	dirty: PropTypes.bool,
	onChange: PropTypes.func
};
