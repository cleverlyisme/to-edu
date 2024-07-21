import React from "react"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap"

export default ({
    isOpen,
    toggle,
    title,
    children,
    onConfirm,
    viewOnly,
    noFooter,
}) => (
    <Modal toggle={toggle} isOpen={isOpen} centered>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        {!noFooter && (
            <ModalFooter>
                {onConfirm && !viewOnly && (
                    <Button color="primary" onClick={onConfirm}>
                        Xác nhận
                    </Button>
                )}
                <Button color="secondary" onClick={toggle}>
                    Hủy bỏ
                </Button>
            </ModalFooter>
        )}
    </Modal>
)
