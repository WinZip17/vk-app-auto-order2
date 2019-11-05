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

//токен из настройки группы
const token = "3d251f99a623c1e0c471840deedbacb0607c295a6dfadf3dce70da90784373b24de4b15650ceb9ccc04e9";

//id группы с которой работаем
const group_id = 185650440;


//ИД пользователя, которому отправлять заказ
const user_id = "15267742";

//Токен приложения
const tokenApp = "85685eaa85685eaa85685eaa2d8504b3b58856885685eaad8e8ae5c720f4db08e7e9ee0";

//ID приложения
const app_id = 7138591;





//получение ссылки на загрузку фотки
const postPhotoUrl = (album_id, newToken) => {
    connect.send("VKWebAppCallAPIMethod", {
        "method": "photos.getUploadServer", "request_id": "photoUrl", "params": {
            "album_id": album_id,
            "v": "5.103", "access_token": newToken
        }
    });
};

//отправка фотки на сервер
const postPhoto = (url, photo, newToken, album_id) => {
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
                savePhoto(data.server, data.photos_list, data.hash, newToken, album_id);
            } else {
                // proccess server errors
            }
        })
        .catch(function (error) {
            // proccess network errors
        });
};


//сохранение фотки
const savePhoto = (server, photos_list, hash, newToken, album_id) => {
    connect.send("VKWebAppCallAPIMethod", {
        "method": "photos.save", "request_id": "photoSave", "params": {
            "album_id": album_id, "server": server, "photos_list": photos_list, "hash": hash, "v": "5.101", "access_token": newToken
        }
    });
};


//получение списка альбомов пользователя
const getAlbum = (id, nToken) => {
    connect.send("VKWebAppCallAPIMethod", {
        "method": "photos.getAlbums", "request_id": "userAlbums", "params": {
            "owner_id": id, "v": "5.103", "access_token": nToken
        }
    });
}

//создание албома если его нет
const createAlbum = (title, description, nToken) => {
    connect.send("VKWebAppCallAPIMethod", {
        "method": "photos.createAlbum", "request_id": "createAlbum", "params": {
            "title": title, "description": description, "v": "5.103", "access_token": nToken
        }
    });
}


//сама основная компонента
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
            imgForMessage: "",
            postSendId: 0,
            activeStory: 'inquiry',
            сities: [],
            tempImg:null,
            access_token_photo: "",
            albumIdForPhoto: ""
        };
        this.onStoryChange = this.onStoryChange.bind(this);
    }

    onStoryChange (e) {
        this.setState({ activeStory: e.currentTarget.dataset.story })
    }

    componentDidMount() {
        connect.subscribe((e) => {

            switch (e.detail.type) {
                case 'VKWebAppGetUserInfoResult':
                    this.setState({fetchedUser: e.detail.data});
                    if (e.detail.data.sex === 1) {
                        this.setState({male: false});
                    }
                    break;
                case 'VKWebAppAccessTokenReceived':
                    if (this.state.access_token_photo.length === 0) {
                        this.setState({access_token_photo: e.detail.data.access_token});
                        getAlbum(this.state.fetchedUser.id, e.detail.data.access_token)
                    } else {

                    }
                    break;
                case "VKWebAppAllowMessagesFromGroupResult":
                    if (e.detail.data.result){
                        this.sendOrder()
                    }
                    break
                case 'VKWebAppCallAPIMethodResult':
                    switch (e.detail.data.request_id) {
                        case 'userAlbums':
                            const find = "Поиск автозапчастей";
                            const group = e.detail.data.response.items
                            if (e.detail.data.response.count === 0) {
                                createAlbum(find, find, this.state.access_token_photo)
                            } else if (group.find(x => x.title === find) === undefined) {
                                createAlbum(find, find, this.state.access_token_photo)
                            } else {
                                let albumId = group.find(x => x.title === find).id
                                this.setState({albumIdForPhoto: albumId})
                                postPhotoUrl(albumId, this.state.access_token_photo)
                            }
                            break;
                        case 'createAlbum':
                            this.setState({albumIdForPhoto: e.detail.data.response.id})
                            postPhotoUrl(e.detail.data.response.id, this.state.access_token_photo)
                            break;
                        case 'Cities':
                            this.setState({сities: e.detail.data.response.items});
                            break;
                        case 'photoUrl':
                            this.setState({imageUrl: e.detail.data.response.upload_url});
                            postPhoto(e.detail.data.response.upload_url, this.state.img, this.state.access_token_photo, e.detail.data.response.album_id)
                            break;
                        case 'photoSave':
                            this.setState({imgForMessage: `photo${e.detail.data.response[0].owner_id}_${e.detail.data.response[0].id}`});
                            this.sendOrder();
                            break;
                        case 'sendOrder':
                            this.setState({
                                postSendId: e.detail.data.response.post_id, field1: "",
                                field2: "", field3: "", field4: "",
                                field5: "", field6: "", field7: "", img: null, activePanel: "addpost"
                            });
                            break;
                        default:
                            console.log(e);
                    }
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


    gerTokenUser = () => {
        connect.send("VKWebAppGetAuthToken", {"app_id": app_id, "scope": "photos"});
    }

    sendForms = () => {
        this.setState({activePanel: "spinner"})
        if (this.state.img === null) {
            this.setAllowMessagesFromGroup();
        } else {
            this.gerTokenUser()
        }
    };

    setAllowMessagesFromGroup = () => {
        connect.send("VKWebAppAllowMessagesFromGroup", {"group_id": group_id, "key": "AllowMessagesFromGroup"});
    };

    sendOrder = () => {
        let attachments = this.state.imgForMessage;
        let userInfo = this.state.fetchedUser;
        let name = this.state.field1;
        let mark = this.state.field2;
        let model = this.state.field3;
        let kod = this.state.field4;
        let cities = this.state.field5;
        let phone = this.state.field6;
        let dodInfo = this.state.field7;
        let sendInfo = `Пользователь: https://vk.com/id${userInfo.id}, имя: ${userInfo.first_name}. Название детали: ${name}. Марка:  ${mark}.  Модель, год выпуска:  ${model}. VIN код или № кузова:  ${kod}. Город:  ${cities}. Телефон:  ${phone}. Дополнительная информация:  ${dodInfo}. `

        let guid = Math.floor(1000000000 + Math.random() * (9000000000 + 1 - 1000000000));
        console.log(sendInfo)
        connect.send("VKWebAppCallAPIMethod", {
            "method": "messages.send",
            "request_id": "sendOrder",
            "params": {
                "user_id": user_id,
                "v": "5.103",
                "random_id": guid,
                "peer_id": `-${group_id}`,
                "message": sendInfo,
                "attachment": attachments,
                "access_token": token
            }
        });
    };


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
                                    Приложение «Фортуна АВТО – поиск» создано для поиска автозапчастей.
                                </h2>
                                    <p>
                                    1. Заполните форму и разместите запрос на нужные автозапчасти.
                                    </p>
                                <p>
                                    2. В личные сообщения Вконтакте Вам придет предложение от группы ВК Фортуна АВТО с выбором производителей и с ценами на запрашиваемые автозапчасти.
                                </p>
                                <p>
                                    3. Переписывайтесь с ними, уточняйте любые вопросы: условия доставки, оплаты, предоставления гарантии, возврата и выбирайте самый подходящий для вас товар.
                                </p>
                                <p>
                                    Остались вопросы? Задайте их администратору в личных сообщениях группы ВК «Фортуна АВТО» <br/>
                                </p>
                                    <a href='https://vk.com/fortuna_parts'>Политика конфиденциальности сервиса.</a><br/>
                                    <a href='https://vk.com/fortuna_parts'>Условия использования сервиса.</a>
                            </Div>
                        </Panel>
                    </View>
                </Epic>
        );
    }
}


export default App;

