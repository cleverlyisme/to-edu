import React from "react"
import { connect } from "react-redux"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap"

import setModal from "../../redux/action/setModal"

function ModalContainer(props) {
    const { isOpen, type, message, onConfirm } = props

    const modalInfo = () => {
        switch (type) {
            case "danger":
                return {
                    header: "Lỗi",
                    color: "#dc3545",
                }

            case "warning":
                return {
                    header: "Cảnh báo",
                    color: "#ffc107",
                }

            case "success":
                return {
                    header: "Thành công",
                    color: "#28a745",
                }

            default:
                return {
                    header: "Thông báo",
                    color: "#007bff",
                }
        }
    }

    const toggle = () => props.setModal({ isOpen: !isOpen })

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered>
            <ModalHeader
                toggle={() => props.setModal({ isOpen: !isOpen })}
                style={{ backgroundColor: modalInfo().color }}
            >
                {modalInfo().header}
            </ModalHeader>

            <ModalBody>{message}</ModalBody>

            <ModalFooter>
                {onConfirm && (
                    <Button
                        color={type}
                        onClick={() => {
                            onConfirm()
                            toggle()
                        }}
                    >
                        Xác nhận
                    </Button>
                )}
                <Button color="secondary" onClick={toggle}>
                    Hủy bỏ
                </Button>
            </ModalFooter>
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    isOpen: state.modal.isOpen,
    type: state.modal.type,
    message: state.modal.message,
    onConfirm: state.modal.onConfirm,
    onCancel: state.modal.onCancel,
})

const mapDispatchToProps = {
    setModal,
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer)
