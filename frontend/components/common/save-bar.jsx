import PropTypes from "prop-types";
import { SaveBar as ShopifySaveBar } from "@shopify/app-bridge-react";

export function SaveBar({ open = false, loading = false, onSave = () => {}, onDiscard = () => {} }) {
	return (
		<ShopifySaveBar id="save-bar" open={open}>
			{/* eslint-disable-next-line react/no-unknown-property */}
			<button variant="primary" loading={loading ? "" : undefined} onClick={onSave}></button>
			<button onClick={onDiscard}></button>
		</ShopifySaveBar>
	);
}

SaveBar.propTypes = {
	open: PropTypes.bool,
	loading: PropTypes.bool,
	onSave: PropTypes.func,
	onDiscard: PropTypes.func
};
