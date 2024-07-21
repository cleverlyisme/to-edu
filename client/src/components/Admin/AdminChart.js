import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Row, Col } from "reactstrap"
import Chart from "react-apexcharts"

import AdminBlock from "./AdminBlock"
import getAdminChart from "../../redux/action/getAdminChart"

const AdminChart = (props) => {
    const [data, setData] = useState({})

    useEffect(() => {
        props.getAdminChart().then((data) => setData(data))
    }, [])

    const pieChart = data?.pieChart
    const columnChart = data?.columnChart

    const pieState = {
        series: pieChart ? Object.values(pieChart) : [],
        options: {
            chart: {
                width: 380,
                type: "pie",
            },
            legend: {
                position: "bottom",
            },
            labels: ["Khối 6", "Khối 7", "Khối 8", "Khối 9"],
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        chart: {
                            width: 440,
                        },
                    },
                },
            ],
        },
    }
    const columnState = {
        series: [
            {
                name: "Học sinh giỏi",
                data: columnChart ? columnChart.map((item) => item.good) : [],
            },
            {
                name: "Học sinh tiên tiến",
                data: columnChart ? columnChart.map((item) => item.medium) : [],
            },
            {
                name: "Học sinh trung bình",
                data: columnChart ? columnChart.map((item) => item.bad) : [],
            },
            {
                name: "Học sinh yếu",
                data: columnChart
                    ? columnChart.map((item) => item.veryBad)
                    : [],
            },
        ],
        options: {
            chart: {
                type: "bar",
                height: 350,
                stacked: true,
                stackType: "100%",
                toolbar: {
                    show: false,
                },
            },
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        legend: {
                            position: "bottom",
                            offsetX: -10,
                            offsetY: 0,
                        },
                    },
                },
            ],
            xaxis: {
                categories: columnChart
                    ? columnChart.map((item) => item.time)
                    : [],
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: "bottom",
            },
        },
    }

    return (
        <Row>
            <Col md={6} className="mb-4">
                <AdminBlock
                    title="Tỷ lệ học sinh các khối trong trường"
                    icon="fas fa-chart-pie"
                    height="400px"
                >
                    {pieChart && (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <Chart
                                options={pieState.options}
                                series={pieState.series}
                                type="pie"
                                width={380}
                            />
                        </div>
                    )}
                </AdminBlock>
            </Col>

            <Col md={6} className="mb-4">
                <AdminBlock
                    title="Phân loại học sinh 6 học kỳ gần nhất"
                    icon="fas fa-chart-bar"
                    height="400px"
                >
                    {columnChart && (
                        <Chart
                            options={columnState.options}
                            series={columnState.series}
                            type="bar"
                            height={350}
                        />
                    )}
                </AdminBlock>
            </Col>
        </Row>
    )
}

const mapDispatchToProps = {
    getAdminChart,
}

export default connect(null, mapDispatchToProps)(AdminChart)
