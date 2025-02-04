import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Page, Grid } from "@shopify/polaris";
import { SaveBar } from "@/components/common";
import { ModuleToggle } from "@/components/general";
import { AllModuleData } from "@/const";
import { changeShopModuleStatus } from "@/redux/slices/general";
import { useStateChange } from "@/hooks";
import * as httpFacade from "@/api-fetch/http";

const gridColumnSpan = { xs: 6, sm: 6, md: 3, lg: 6, xl: 6 };
const moduleIds = Array.from(AllModuleData.keys());
const moduleUploadCodes = moduleIds;

export default function Configurations() {
	const shopify = useAppBridge();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { domain, allModuleStatusData } = useSelector((state) => state.general.user);
	const [loading, setLoading] = useState(false);
	const [moduleStatusMapping, setModuleStatusMapping] = useState({});
	const [dirty, previousState, setPreviousState] = useStateChange(moduleStatusMapping);

	const handleModuleStatusChange = useCallback(function (moduleId, status) {
		setModuleStatusMapping(function (moduleStatusMapping) {
			shopify.toast.show(t(status ? "Module enabled" : "Module disabled"), { duration: 1000 });
			return { ...moduleStatusMapping, [moduleId]: status };
		});
	}, []);

	const handleSaveBarSave = useCallback(async function () {
		setLoading(true);

		const statusData = Object.entries(moduleStatusMapping).map(([id, status]) => ({ id, status }));
		const response = await httpFacade.request(httpFacade.UPDATE_SHOP_MODULES, { domain, modulesData: statusData });

		if (response.success) {
			dispatch(changeShopModuleStatus(statusData));
			shopify.toast.show(t("Modules updated"), { duration: 2000 });
			await httpFacade.request(httpFacade.SHOP_UPLOAD_CONTENT, { domain, parts: moduleUploadCodes.join(",") });
		} else {
			shopify.toast.show(t("Update modules failed"), { duration: 2000 });
		}

		setLoading(false);
	}, [domain, moduleStatusMapping]);

	const handleSaveBarDiscard = useCallback(function () {
		setModuleStatusMapping(previousDataRef.current);
	}, [previousDataRef]);

	useEffect(function () {
		const statusMapping = {};
		for (const moduleId in allModuleStatusData) {
			statusMapping[moduleId] = !!allModuleStatusData[moduleId].status;
		}
		setModuleStatusMapping(statusMapping);
		setPreviousState(statusMapping);
	}, [allModuleStatusData]);

	return (
		<Page title="Configurations">
			<SaveBar open={dirty} loading={loading} onSave={handleSaveBarSave} onDiscard={handleSaveBarDiscard} />
			<Grid>
				{moduleIds.map(function (moduleId) {
					const status = moduleStatusMapping[moduleId];
					const onChange = (value) => handleModuleStatusChange(moduleId, value);

					return (
						<Grid.Cell columnSpan={gridColumnSpan} key={moduleId}>
							<ModuleToggle moduleId={moduleId} status={status} dirty={dirty} loading={loading} onChange={onChange}/>
						</Grid.Cell>
					);
				})}
			</Grid>
		</Page>
	);
}
