import PropTypes from "prop-types";

export function Switch({ enable = false, loading = false, onChange = () => {} }) {
	return "";
}

Switch.propTypes = {
	enable: PropTypes.bool,
	loading: PropTypes.bool,
	onChange: PropTypes.func,
}
