import React from 'react';
import PropTypes from 'prop-types';
import {Panel, Button, Group, Div,  PanelHeader, Input, FormLayout, Textarea} from '@vkontakte/vkui';
import File from "@vkontakte/vkui/dist/components/File/File";
import SelectMimicry from "@vkontakte/vkui/dist/es6/components/SelectMimicry/SelectMimicry";
import Icon24Camera from '@vkontakte/icons/dist/24/camera';


const Home = ({ id, go, fetchedUser, ...props }) => {

	return (
		<Panel id={id}>
		<PanelHeader>Разместить запрос</PanelHeader>

		<Group>
			<Div>
				<div>
					<div>
						<FormLayout>
							<Input  top={<span>1. Название запчасти<span className='red'> * </span></span>} name="field1" value={props.innquiryInfo.field1} onChange={props.сhangeForms} type="text"/>
							<SelectMimicry
								top={<span>2. Марка автомобиля<span className='red'> * </span></span>}
								placeholder="не выбрана"
								onClick={() => props.setActivePanel("searchMark")}
							>{props.innquiryInfo.field2}</SelectMimicry>
							<Input  top={<span>3. Модель, год выпуска автомобиля<span className='red'> * </span></span>} name="field3" value={props.innquiryInfo.field3}   onChange={props.сhangeForms}  type="text" placeholder="Укажите модель и год выпуска"/>
							<Input  top={<span>4. VIN код или № кузова<span className='red'> * </span></span>} name="field4" value={props.innquiryInfo.field4}  onChange={props.сhangeForms}  type="text" placeholder="Укажите VIN код или № кузова *"/>
							<SelectMimicry
								top={<span>5. Город<span className='red'> * </span></span>}
								placeholder="не выбран"
								onClick={() => props.setActivePanel("searchCities")}
							>{props.innquiryInfo.field5}</SelectMimicry>
							<Input  top="6. Номер телефона" name="field6" value={props.innquiryInfo.field6}  onChange={props.changePhone}  type="text" />
							<Textarea  top="Дополнительная инфоормация" name="field7" value={props.innquiryInfo.field7}  onChange={props.сhangeForms}  />
							<File  onChange={props.сhangeForms} name="file"  type="file" before={<Icon24Camera />}  accept="image/*">Прикрепить </File>
						</FormLayout>
					</div>
				</div>
				{props.innquiryInfo.img !== null ? <img className="imgFormat" src={props.innquiryInfo.imageUrl} alt="detal"></img> : <div/>}
				{props.innquiryInfo.isReady ? <Button size="xl" onClick={props.sendForms}>Отправить</Button> : <Button size="xl" disabled level="2">Отправить</Button> }

			</Div>
		</Group>
	</Panel>)
};




Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	sendForms: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
