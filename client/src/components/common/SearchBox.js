import React from "react"
import { Input, Form, FormGroup } from "reactstrap"

export default function (props) {
    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault()
                props.onSearch()
            }}
        >
            <FormGroup className="mb-2">
                <Input
                    type="text"
                    placeholder={props.placeholder || "Tìm kiếm"}
                    onChange={props.onChange}
                />
            </FormGroup>
        </Form>
    )
}
