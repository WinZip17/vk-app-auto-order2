import React from 'react';
import {Panel, PanelHeader} from '@vkontakte/vkui';
import Spinner from "@vkontakte/vkui/dist/components/Spinner/Spinner";
import PropTypes from 'prop-types';
import Div from "@vkontakte/vkui/dist/components/Div/Div";


const SendOrder = props => (
	<Panel id={props.id}>
		<PanelHeader>Найти потеряшку</PanelHeader>
		<Div>
			<h1>Ваш опрос успешно добавлен!</h1>
		</Div>
	</Panel>
);

SendOrder.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default SendOrder;
