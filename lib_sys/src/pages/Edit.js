import React, { useEffect, useState } from 'react'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { userSchema } from './UserValidation'
// eslint-disable-next-line
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'


import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { itemNames } from '../components/ListItemName';

export default function Edit() {
    
    const location = useLocation();
    const getId = location.state.id;

    const [udpID, setUdpID] = useState();
    const loadData = async () => {
        const response = await axios.get("http://localhost:3001/getID")
        setUdpID(response.data.data);
    }
    useEffect(() => {
        loadData();
    },[]);
    
    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [nameKana, setNameKana] = useState('')
    const [birthday, setBirthday] = useState()
    const [gender, setGender] = useState('男性')
    const handleRadio = (event) => { setGender(event.target.value) }
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [postCode, setPostCode] = useState('')
    const [address, setAddress] = useState('')

    const navigate = useNavigate()

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(userSchema),
    })

    const getMember = () => {
        axios.get('http://localhost:3001/get', { params: { getMemberID: getId } }).then((response) => {
            if (response.data.length === 0) {
                alert('会員情報呼び出しエラー。')
                navigate('/manager')
            } else if (response.data.error) {
                alert('会員情報呼び出しエラー。')
                navigate('/manager')
            } else {
                const r = response.data[0]
                setId(getId)
                setPassword(r.password)
                setName(r.name)
                setNameKana(r.name_kana)
                setBirthday(getYmd(r.birthday))
                setGender(r.gender)
                setEmail(r.email)
                setPhone(r.phone)
                setPostCode(r.postcode)
                setAddress(r.address)
                reset()
            }
        })
    }

    const updMember = () => {
        axios.put('http://localhost:3001/update', {
            name: name, nameKana: nameKana, birthday: birthday, 
            gender: gender, email: email, phone: phone, 
            postCode: postCode, address: address, udpID: udpID, id: getId
        }).then((response) => {
            switch (response.data.message) {
                case 'updated':
                    alert('修正完了')
                    navigate('/manager')
                    break
                case 'dup email':
                    alert('メールアドレスが重複しています。')
                    handleClose()
                    break
                case 'dup phone':
                    alert('電話番号が重複しています。')
                    handleClose()
                    break
                default:
                    alert('DBエラー。担当者にお問い合わせください。', response.data.error)
            }
        })
    }

    const getYmd = (birthday) => {
        let d = new Date(birthday)
        return d.getFullYear() + '-' + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : '0' + (d.getMonth() + 1)) + '-' + (d.getDate() > 9 ? d.getDate().toString() : '0' + d.getDate().toString())
    }

    const genderText = () => {
        if (gender === 'm') {
            return '男性'
        }
        return '女性'
    }

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    useEffect(() => {
        getMember()
        // eslint-disable-next-line
    }, [])

    // const itemNames = ["ユーザーID", "パスワード", "名前(漢字)", "名前(カタカナ)", "生年月日", "性別", "メールアドレス", "電話番号", "郵便番号", "住所"]
    const items = [id, password, name, nameKana, birthday, genderText(), email, phone, postCode, address]
    const itemList = (itemNames, items) => {
        const result = []
        for (let i = 0; i < itemNames.length; i++) {
            result.push(<Row key={i} className="mb-2">
                <Col sm={4} className="text-end text-secondary">{itemNames[i]}</Col>
                <Col sm={6}>{items[i]} </Col>
            </Row>)
        }
        return result
    }

    return (
        <div className="card my-5 mx-auto" style={{ width: "25rem" }}>
            <div className="card-body">
                <h4 className="mt-1">会員情報修正</h4>
                <div className="border-bottom mt-3" style={{ margin: "-16px" }}></div>
                <form noValidate name="allForm" onSubmit={handleSubmit((() => {
                    handleShow()
                }))}>
                    <Form.Group className="mt-4 mb-3">
                        <Form.Label className="fw-bold">名前（漢字）</Form.Label>
                        <Form.Control defaultValue={name} {...register('name')} type="text" placeholder="図書タロウ" onChange={(event) => {
                            setName(event.target.value)
                        }} />
                        <span className="errors">{errors?.nameKanji?.message}</span>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bolder">名前（カタカナ）</Form.Label>
                        <Form.Control defaultValue={nameKana}  {...register('nameKana')} type="text" placeholder="トショタロウ" onChange={(event) => {
                            setNameKana(event.target.value)
                        }} />
                        <span className="errors">{errors?.nameKana?.message}</span>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">生年月日</Form.Label>
                        <div className="col-md-auto">
                            <Form.Group >
                                <Form.Control defaultValue={birthday} type="date" name="dob" {...register('birthday')} onChange={(event) => {
                                    setBirthday(event.target.value)
                                    setPassword(event.target.value.replace(/-/g, ''))
                                }} />
                                <span className="errors">{errors?.birthday?.message}</span>
                            </Form.Group>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">性別</Form.Label>
                        <div>
                            <div className="form-check form-check-inline">
                                <input checked={gender === 'm'} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value='m' onChange={handleRadio} />
                                <label className="form-check-label" htmlFor="inlineRadio1">男性</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input checked={gender === 'f'} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value='f' onChange={handleRadio} />
                                <label className="form-check-label" htmlFor="inlineRadio2">女性</label>
                            </div>
                            <div className="errors">{errors?.gender?.message}</div>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">メールアドレス</Form.Label>
                        <Form.Control defaultValue={email} {...register('email')} type="email" placeholder="mirine@global.com" onChange={(event) => {
                            setEmail(event.target.value)
                        }} />
                        <span className="errors">{errors?.email?.message}</span>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">電話番号</Form.Label>
                        <Form.Control defaultValue={phone}{...register('phone')} type="tel" placeholder="09012345678" onChange={(event) => {
                            setPhone(event.target.value)
                        }} />
                        <span className="errors">{errors?.phone?.message}</span>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">郵便番号</Form.Label>
                        <Form.Control defaultValue={postCode} {...register('post')} type="number" placeholder="1350051" onChange={(event) => {
                            setPostCode(event.target.value)
                        }} />
                        <span className="errors">{errors?.post?.message}</span>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">住所</Form.Label>
                        <Form.Control defaultValue={address}{...register('address')} type="text" placeholder="東京都豊島区駒込１ー２ー３ミリネビル２０１" onChange={(event) => {
                            setAddress(event.target.value)
                        }} />
                        <span className="errors">{errors?.address?.message}</span>
                    </Form.Group>
                    <div className="border-bottom mt-3" style={{ margin: "-16px" }}></div>
                    <div className="float-start" style={{ marginTop: "30px" }}>
                        <Button variant="secondary" onClick={()=>{navigate("/manager")}}>戻る</Button>
                    </div>
                    <div className="float-end" style={{ marginTop: "30px" }}>
                        <Button variant="secondary" onClick={(() => {
                            getMember()
                        })}>リセット</Button>
                        <Button type="submit" className="ms-2" variant="primary">登録</Button>
                    </div>
                </form>
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title> 修正情報確認</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {itemList(itemNames, items)}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>戻る</Button>
                        <Button variant="primary" onClick={updMember}>確定</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div >
    )
}