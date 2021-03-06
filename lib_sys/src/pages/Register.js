import React, { useState } from 'react'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { userSchema } from './UserValidation'
// eslint-disable-next-line
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

export default function Register() {
    const regID = '100000'

    //const [id, setID] = useState('')
    const [id, setID] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [nameKana, setNameKana] = useState('')
    const [birthday, setBirthday] = useState()
    const [gender, setGender] = useState(0)
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [postCode, setPostCode] = useState('')
    const [address, setAddress] = useState('')
    const [authorityCODE, setAuthorityCODE] = useState(0)
    const [memberList, setMemberList] = useState([])

    const navigate = useNavigate()

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(userSchema),
    });

    const setMember = () => {
        setMemberList([...memberList, {
            id: id, password: password, name: name, nameKana: nameKana, birthday: birthday, gender: gender, email: email, phone: phone, postCode: postCode, address: address, authorityCODE: authorityCODE,
        }])
    }

    const addMember = () => {
        Axios.post('http://localhost:3001/register', {
            id: id, password: password, name: name, nameKana: nameKana, birthday: birthday, gender: gender, email: email, phone: phone, postCode: postCode, address: address, authorityCODE: authorityCODE, regID: regID
        }).then((response) => {
            if (response.data.message) {
                alert('????????????')
                navigate('/manager')
            } else {
                alert('ID??????????????????????????????????????????????????????????????????????????????')
                handleClose()
            }
        })
    }

    const getYmd = () => {
        let d = new Date(birthday)
        return d.getFullYear() + '-' + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : '0' + (d.getMonth() + 1)) + '-' + (d.getDate() > 9 ? d.getDate().toString() : '0' + d.getDate().toString())
    }

    const genderText = () => {
        if (gender === 0) {
            return '??????'
        }
        return '??????'
    }

    const authorityText = () => {
        if (authorityCODE === 0) {
            return '????????????'
        }
        return '?????????'
    }

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    return (
        <div className="card my-5 mx-auto" style={{ width: "25rem" }}>
            <div className="card-body">
                <h4 className="mt-1">??????????????????</h4>
                <div className="border-bottom mt-3" style={{ margin: "-16px" }}></div>
                <form noValidate name="allForm" onSubmit={handleSubmit((() => {
                    setID(Math.floor(Math.random() * 900000) + 100000)
                    setMember()
                    handleShow()
                }))}>
                    <Form.Group className="mt-4 mb-3">
                        <Form.Label className="fw-bold">??????????????????</Form.Label>
                        <Form.Control {...register('name')} type="text" placeholder="???????????????" onChange={(event) => {
                            setName(event.target.value)
                        }} />
                        <span className="errors">{errors?.name?.message}</span>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bolder">????????????????????????</Form.Label>
                        <Form.Control {...register('nameKana')} type="text" placeholder="??????????????????" onChange={(event) => {
                            setNameKana(event.target.value)
                        }} />
                        <span className="errors">{errors?.nameKana?.message}</span>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">????????????</Form.Label>
                        <div className="col-md-auto">
                            <Form.Group >
                                <Form.Control type="date" name="dob" {...register('birthday')} onChange={(event) => {
                                    setBirthday(event.target.value)
                                    setPassword(event.target.value.replace(/-/g, ''))
                                }} />
                                <span className="errors">{errors?.birthday?.message}</span>
                            </Form.Group>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">??????</Form.Label>
                        <div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" onChange={(event) => {
                                    if (event.target.checked) {
                                        setGender(0)
                                    }
                                }} checked={gender === 0} />
                                <label className="form-check-label" htmlFor="inlineRadio1">??????</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" onChange={(event) => {
                                    if (event.target.checked) {
                                        setGender(1)
                                    }
                                }} />
                                <label className="form-check-label" htmlFor="inlineRadio2">??????</label>
                            </div>
                            <div className="errors">{errors?.gender?.message}</div>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">?????????????????????</Form.Label>
                        <Form.Control {...register('email')} type="email" placeholder="mirine@global.com" onChange={(event) => {
                            setEmail(event.target.value)
                        }} />
                        <span className="errors">{errors?.email?.message}</span>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">????????????</Form.Label>
                        <Form.Control {...register('phone')} type="tel" placeholder="09012345678" onChange={(event) => {
                            setPhone(event.target.value)
                        }} />
                        <span className="errors">{errors?.phone?.message}</span>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">????????????</Form.Label>
                        <Form.Control {...register('post')} type="number" placeholder="1350051" onChange={(event) => {
                            setPostCode(event.target.value)
                        }} />
                        <span className="errors">{errors?.post?.message}</span>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">??????</Form.Label>
                        <Form.Control {...register('address')} type="text" placeholder="???????????????????????????????????????????????????????????????" onChange={(event) => {
                            setAddress(event.target.value)
                        }} />
                        <span className="errors">{errors?.address?.message}</span>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="flexCheckDefault" onChange={(event) => {
                                if (event.target.checked) {
                                    setAuthorityCODE(1)
                                } else {
                                    setAuthorityCODE(0)
                                }
                            }} />
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                ??????????????????????????????????????????
                            </label>
                        </div>
                    </Form.Group>
                    <div className="border-bottom mt-3" style={{ margin: "-16px" }}></div>
                    <div className="float-end" style={{ marginTop: "30px" }}>
                        <Button variant="secondary" onClick={(() => {
                            reset()
                        })}>?????????</Button>
                        <Button type="submit" className="ms-2" variant="primary">??????</Button>
                    </div>
                </form>
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>??????????????????</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row className="mb-2">
                                <Col sm={4} className="text-end text-secondary">????????????ID&nbsp;&nbsp;|</Col>
                                <Col sm={6}>{id} </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col sm={4} className="text-end text-secondary">???????????????&nbsp;&nbsp;|</Col>
                                <Col sm={6}>{password}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col sm={4} className="text-end text-secondary">??????(??????)&nbsp;&nbsp;|</Col>
                                <Col sm={6}>{name}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col sm={4} className="text-end text-secondary">??????(????????????)&nbsp;&nbsp;|</Col>
                                <Col sm={6}>{nameKana}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col sm={4} className="text-end text-secondary">????????????&nbsp;&nbsp;|</Col>
                                <Col sm={6}>{getYmd()}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col sm={4} className="text-end text-secondary">??????&nbsp;&nbsp;|</Col>
                                <Col sm={6}>{genderText()}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col sm={4} className="text-end text-secondary">?????????????????????&nbsp;&nbsp;|</Col>
                                <Col sm={6}>{email}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col sm={4} className="text-end text-secondary">????????????&nbsp;&nbsp;|</Col>
                                <Col sm={6}>{phone}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col sm={4} className="text-end text-secondary">????????????&nbsp;&nbsp;|</Col>
                                <Col sm={6}>{postCode}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col sm={4} className="text-end text-secondary">??????&nbsp;&nbsp;|</Col>
                                <Col sm={6}>{address}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col sm={4} className="text-end text-secondary">??????&nbsp;&nbsp;|</Col>
                                <Col sm={6}>{authorityText()}</Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>??????</Button>
                        <Button variant="primary" onClick={addMember}>??????</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div >
    )
}