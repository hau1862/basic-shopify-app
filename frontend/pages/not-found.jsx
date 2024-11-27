import { Card, EmptyState, Page } from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import { emptyStateImage } from "../images";

export default function NotFound() {
	const { t } = useTranslation();
	return (
		<Page>
			<Card>
				<Card.Section>
					<EmptyState heading={t("NotFound.heading")} image={emptyStateImage}>
						<p>{t("NotFound.description")}</p>
					</EmptyState>
				</Card.Section>
			</Card>
		</Page>
	);
}
