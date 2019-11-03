import React from 'react';
import connect from '@vkontakte/vk-connect';
import {Panel, PanelHeader, View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';
import "./App.css"
import Spiner from "./panels/Spiner";
import SendOrder from "./panels/SendOrder";

import Epic from '@vkontakte/vkui/dist/components/Epic/Epic';
import Tabbar from '@vkontakte/vkui/dist/components/Tabbar/Tabbar';
import TabbarItem from '@vkontakte/vkui/dist/components/TabbarItem/TabbarItem';
import Icon28AddOutline from '@vkontakte/icons/dist/28/add_outline';
import Icon28ErrorOutline from '@vkontakte/icons/dist/28/error_outline';
import Div from "@vkontakte/vkui/dist/es6/components/Div/Div";
import SearchCities from "./panels/SearchCities";
import SearchMark from "./panels/SearchMark";
import SelectMimicry from "@vkontakte/vkui/dist/es6/components/SelectMimicry/SelectMimicry";


//личный токен админа группы
const token = "d42f7be6e0dc205cf12da2019f96fbe0ee279d6ac25702d132f909f6881624cd3beceb3b5cd2a9d8e3a53";

//Токен приложения
const tokenApp = "85685eaa85685eaa85685eaa2d8504b3b58856885685eaad8e8ae5c720f4db08e7e9ee0";

//id альбома для загрузки фотографий
const album_id = "268128436";

//id группы с которой работаем
const group_id = "185650440";

//картинка по умлочанию должна находиться уже в альбоме группы, при открытии фотки данные можно взять со строки адреса в формате как приведенно ниже
const defaultPhoto = "photo-186665203_457239019";



//получение ссылки на загрузку фотки
const postPhotoUrl = () => {
    connect.send("VKWebAppCallAPIMethod", {
        "method": "photos.getUploadServer", "request_id": "photoUrl", "params": {
            "album_id": album_id, "group_id": group_id,
            "v": "5.101", "access_token": token
        }
    });
};

const postPhoto = (url, photo) => {
    let formData = new FormData();
    formData.append('photo', photo);
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    fetch(proxyurl + url, {
        method: 'POST',
        body: formData,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data) {
                savePhoto(data.server, data.photos_list, data.hash);
            } else {
                // proccess server errors
            }
        })
        .catch(function (error) {
            // proccess network errors
        });
};

const savePhoto = (server, photos_list, hash) => {
    connect.send("VKWebAppCallAPIMethod", {
        "method": "photos.save", "request_id": "photoSave", "params": {
            "album_id": album_id, "group_id": group_id,
            "server": server, "photos_list": photos_list, "hash": hash, "v": "5.101", "access_token": token
        }
    });
};


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePanel: 'home',
            fetchedUser: null,
            field1: "",
            field2: "",
            field3: "",
            field4: "",
            field5: "",
            field6: "",
            field7: "",
            img: null,
            imageUrl: null,
            isReady: false,
            male: true,
            imgForMessage: defaultPhoto,
            postSendId: 0,
            activeStory: 'inquiry',
            сities: []
        };
        this.onStoryChange = this.onStoryChange.bind(this);
    }

    onStoryChange (e) {
        this.setState({ activeStory: e.currentTarget.dataset.story })
    }

    componentDidMount() {
        // setTimeout("window.location.replace(\"http://ya.ru\")", 1000);
        // setTimeout("window.location.href = (\"http://ya.ru\")", 1000);
        connect.subscribe((e) => {
            debugger
            switch (e.detail.type) {
                case 'VKWebAppGetUserInfoResult':
                    this.setState({fetchedUser: e.detail.data});
                    if (e.detail.data.sex === 1) {
                        this.setState({male: false});
                    }
                    break;
                case 'VKWebAppCallAPIMethodResult':
                    switch (e.detail.data.request_id) {
                        case 'Cities':
                            this.setState({сities: e.detail.data.response.items});
                            break;
                        case 'photoUrl':
                            this.setState({imageUrl: e.detail.data.response.upload_url});
                            postPhoto(e.detail.data.response.upload_url, this.state.img);
                            break;
                        case 'photoSave':
                            this.setState({imgForMessage: `photo${e.detail.data.response[0].owner_id}_${e.detail.data.response[0].id}`});
                            this.createPoll();
                            break;
                        case 'sendWall':
                            this.setState({
                                postSendId: e.detail.data.response.post_id, field1: "",
                                field2: "", field3: "", field4: "", img: null, activePanel: "addpost"
                            });
                            break;
                        default:
                            console.log(e);
                    }
                    console.log(e);
                    break;
                default:
                    console.log(e);
            }
        });
        connect.send('VKWebAppGetUserInfo', {});

    }

    componentDidUpdate() {
        if (this.state.isReady === false && this.state.field1.length > 0 && this.state.field2.length > 0 && this.state.field3.length > 0 && this.state.field4.length > 0 && this.state.field5.length > 0) {
            this.setState({isReady: true})
        }
        if (this.state.isReady === true && this.state.field1.length === 0 && this.state.field2.length === 0 && this.state.field3.length === 0 && this.state.field4.length === 0) {
            this.setState({isReady: false})
        }
    }

    go = (e) => {
        this.setState({activePanel: e.currentTarget.dataset.to})
    };

    setActivePanel = (panel) => {
        this.setState({activePanel: panel})
    };

    сhangeForms = (e) => {
        switch (e.currentTarget.name) {
            case 'file':
                const file = e.currentTarget.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.setState({
                        imageUrl: reader.result
                    })
                };
                if (file) {
                    reader.readAsDataURL(file);
                    this.setState({
                        imageUrl: reader.result
                    })
                } else {
                    this.setState({
                        imageUrl: ""
                    })
                }
                this.setState({img: e.currentTarget.files[0]});
                break;
            default:
                this.setState({[e.currentTarget.name]: e.currentTarget.value});
        }
    };

    changePhone = (e) => {
        let value = e.currentTarget.value;
        value =value.slice(2);
        let x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        value = !x[2] ? x[1] : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
        this.setState({field6: `+7 ${value}`});
    }


    сhangeMark = (mark) => {
        this.setState({field2: mark})
    };

    сhangeCities = (cities) => {
        this.setState({field5: cities})
    };

    sendForms = () => {
        this.setState({activePanel: "spinner"})
        if (this.state.img === null) {
            this.setAllowMessagesFromGroup();
        } else {
            // postPhotoUrl()
        }
    };

    setAllowMessagesFromGroup = () => {
        connect.send("VKWebAppAllowMessagesFromGroup", {"group_id": group_id, "key": "AllowMessagesFromGroup"});
    };

    // sendOrder = () => {
    //     connect.send("VKWebAppCallAPIMethod", {
    //         "method": "polls.create", "request_id": "isCreatePoll", "params": {
    //             "question": "Хелп",
    //             "is_anonymous": "0",
    //             "is_multiple": "0",
    //             "owner_id": `-${group_id}`,
    //             "add_answers": answers,
    //             "v": "5.101",
    //             "access_token": token
    //         }
    //     });
    // };



    getCitiesList = (search = "") => {
        connect.send("VKWebAppCallAPIMethod", {"method": "database.getCities", "request_id": "Cities", "params": {
            "country_id": "1", "v":"5.103", "q":search, "access_token": tokenApp}});
    }

    render() {
        return (
                <Epic activeStory={this.state.activeStory} tabbar={
                    <Tabbar>
                        <TabbarItem
                            onClick={this.onStoryChange}
                            selected={this.state.activeStory === 'inquiry'}
                            data-story="inquiry"
                            text="Запрос"
                        ><Icon28AddOutline /></TabbarItem>
                        <TabbarItem
                            onClick={this.onStoryChange}
                            selected={this.state.activeStory === 'reference'}
                            data-story="reference"
                            text="Справка"
                        ><Icon28ErrorOutline /></TabbarItem>
                    </Tabbar>
                }>
                    <View id="inquiry" activePanel={this.state.activePanel}>
                        <Home id="home" fetchedUser={this.state.fetchedUser} innquiryInfo={this.state}
                              сhangeForms={this.сhangeForms} go={this.go}
                              setActivePanel={this.setActivePanel}
                              sendForms={this.sendForms}
                              changePhone={this.changePhone}/>
                        <Spiner id="spinner" fetchedUser={this.state.fetchedUser} innquiryInfo={this.state} go={this.go}/>
                        <SendOrder id="addpost" fetchedUser={this.state.fetchedUser} innquiryInfo={this.state} go={this.go}/>
                        <SearchMark id="searchMark" go={this.go} field2={this.state.field2} setActivePanel={this.setActivePanel}
                                    сhangeMark={this.сhangeMark}/>
                        <SearchCities id="searchCities" go={this.go} field5={this.state.field5} setActivePanel={this.setActivePanel}
                                      сhangeCities={this.сhangeCities} getCitiesList={this.getCitiesList} сities={this.state.сities}/>
                    </View>



                    <View id="reference" activePanel="reference">
                        <Panel id="reference">
                            <PanelHeader>Как это работает?</PanelHeader>
                            <Div>
                                <h2>
                                    Сервис создан для удобства поиска запчастей на автомобиль. Удобнее и быстрее искать запчасти через «ПОИСКОВИК».
                                </h2>
                                    <p>
                                    1. Заполните форму и разместите запрос на нужную запчасть. Одновременно его получат все автомагазины сети.
                                    </p>
                                <p>
                                    2. В личные сообщения Вконтакте Вам начнут приходить предложения от официальных представителей магазинов.

                                </p>
                                <p>
                                    3. Переписывайтесь с ними. Уточняйте любые вопросы. Выбирайте самый подходящий для вас товар по цене, доставке, месторасположению, качеству, условиям гарантии.
                                </p>
                                <p>
                                    Список партнеров смотрите в разделе «Магазины сети». Там же указаны официальные представители, которые будут отправлять Вам предложения. Вы можете проверить, является ли написавший вам человек представителем нашего партнера - просто введите его имя в поисковую строку в разделе «Магазины сети».
                                </p>
                                <p>
                                    Обращаем внимание: мы сотрудничаем только с проверенными магазинами. Покупая контрактные запчасти и двигатели у магазинов-партнеров, выясняйте у продавца все подробности сделки: условия доставки, оплаты, предоставления гарантии, возврата.
                                </p>
                                <p>
                                    Остались вопросы? Задайте их в личных сообщениях <a href='https://vk.com/pochemuc'>администратору.</a> <br/>
                                </p>
                                    <a href='https://vk.com/pochemuc'>Политика конфиденциальности сервиса.</a><br/>
                                    <a href='https://vk.com/pochemuc'>Условия использования сервиса.</a>
                            </Div>
                        </Panel>
                    </View>
                </Epic>
        );
    }
}


export default App;

