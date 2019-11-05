import React from 'react';
import {Panel, PanelHeader} from '@vkontakte/vkui';
import PropTypes from 'prop-types';
import Div from "@vkontakte/vkui/dist/components/Div/Div";


const SendOrder = props => (
	<Panel id={props.id}>
		<PanelHeader>Поиск автозапчастей</PanelHeader>
		<Div>
			<h1>Ваш запрос успешно отправлен, <br/> в ближайшее время с Вами свяжутся!</h1>
		</Div>
	</Panel>
);

SendOrder.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default SendOrder;
