let current_selections = {
    'm_button': 'm1',
    'm_button_kren': ['m1', 'm2'],
    'data_mode': false,
    'file_date_from': '',
    'file_date_to': '',
}

let chart = (x_axis_flt_arr, y_axis_flt_arr, labels_str_arr) => {
    document.getElementById("graph-container").innerHTML = '&nbsp;';
    document.getElementById("graph-container").innerHTML = '<canvas id="myChart"></canvas>';
    let ctx = document.getElementById('myChart').getContext('2d');


    let chart_config = {}
    if (current_selections['data_mode']) {
        chart_config = {
            type: 'line',
            data: {
                labels: labels_str_arr,
                datasets:
                    [
                        {
                            label: 'Крен',
                            data: x_axis_flt_arr,
                            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                            borderColor: ['rgba(255, 99, 132, 1)'],
                            borderWidth: 1
                        },
                    ]
            },
            options: {
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Время'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 20,
                            min: -20,
                            stepSize: 1,
                            lineWidth: 3

                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Крен'
                        }
                    }]
                }
            }
        }
    } else if (!current_selections['data_mode']) {
        chart_config = {
            type: 'line',
            data: {
                labels: labels_str_arr,
                datasets:
                    [
                        {
                            label: 'X - Осадка',
                            data: x_axis_flt_arr,
                            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                            borderColor: ['rgba(255, 99, 132, 1)'],
                            borderWidth: 1
                        },
                        {
                            label: 'Y - Горизонт смещения',
                            data: y_axis_flt_arr,
                            backgroundColor: ['rgba(55, 199, 132, 0.2)'],
                            borderColor: ['rgba(55, 199, 132, 1)'],
                            borderWidth: 1
                        }
                    ]
            },
            options: {
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Время'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 20,
                            min: -20,
                            stepSize: 1,
                            lineWidth: 3

                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Отклонение, мм'
                        }
                    }]
                }
            }
        }
    }

    let myChart = new Chart(ctx, chart_config);

    myChart.clear();
}

let getTags = async () => {
    let Url
    if (!current_selections['data_mode']) {
        Url = clean_root_url() + `api/v1/targets/list/?target_id=${current_selections['m_button']}&` +
            `timestamp_range_after=${current_selections['file_date_from']}&` +
            `timestamp_range_before=${current_selections['file_date_to']}`
    } else if (current_selections['data_mode']) {
        Url = clean_root_url() + `api/v1/targets/list/?timestamp_range_after=${current_selections['file_date_from']}&` +
            `timestamp_range_before=${current_selections['file_date_to']}&` +
            `target_id__in=${current_selections['m_button_kren'][0]}, ${current_selections['m_button_kren'][1]}`
    }

    let Headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + get_cookie("access")
    };

    let response = await fetch(Url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: Headers,
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    })

    if (!response.ok) {
        await reload_to_page("")
    }


    return await response.json();
}

let compose_arrays = (res) => {
    let result = {
        "x_axis_flt_arr": [],
        "y_axis_flt_arr": [],
        "labels_str_arr": []
    }
    if (!current_selections['data_mode']) {  // ------------------------------------------------------------  смещение
        for (let elem in res) {
            if (res.hasOwnProperty(elem)) {
                result["x_axis_flt_arr"].push(res[elem]['dx'])
                result["y_axis_flt_arr"].push(res[elem]['dy'])
                result["labels_str_arr"].push(res[elem]['timestamp'].slice(0, 16))
            }
        }
        return result


    } else if (current_selections['data_mode']) { // --------------------------------------------------------  крен
        // НЕ ПЕРЕПИСЫВАТЬ НА РЕКУРСИВНЫЕ МЕТОДЫ -- БОЛЬШАЯ СЛОЖНОСТЬ
        let list = res.reduce((p, c) => {           // собираю аккумулятор по timestamp (точность до минуты, см. slice)
            p[c.timestamp.slice(0, 16)] = (p[c.timestamp.slice(0, 16)] || 0) + 1;
            return p;
        }, {});

        let list_temp = {}
        let new_array = []

        let pair_result = res.filter((item) => {        // нахожу лишнее (все кроме объектов удовлетворяющих условию
            let is_two_items = list[item.timestamp.slice(0, 16)] === 2 // timestamp_m_i === timestamp_m_i+1 &&
            if (is_two_items) {                                        //  target_id_i  !== target_id_i+1 )
                if (!(item.timestamp.slice(0, 16) in list_temp)) {
                    list_temp[item.timestamp.slice(0, 16)] = item.target_id
                    return true
                }

                if (list_temp[item.timestamp.slice(0, 16)] !== item.target_id) {
                    return true
                } else if (list_temp[item.timestamp.slice(0, 16)] === item.target_id) {
                    new_array.push(item.timestamp.slice(0, 16))
                }
            }
        })

        pair_result = pair_result.filter((item) =>  // удаляю найденное
            !new_array.includes(item.timestamp.slice(0, 16))
        )

        let first_target = [] // массивы симметричны по критерию timestamp, хранят для первой и второй метки данные
        let second_target = []  // если все верно - в них равное кол-во элементов

        for (let elem in pair_result) {
            if (pair_result.hasOwnProperty(elem)) {   // разбираю по критериям  target_id_i и target_id_i+1
                if (pair_result[elem]['target_id'] === current_selections['m_button_kren'][0]) {
                    first_target.push(pair_result[elem])
                } else if (pair_result[elem]['target_id'] === current_selections['m_button_kren'][1]) {
                    second_target.push(pair_result[elem])
                }
            }
        }

        const r = 3000;

        for (let elem in first_target) {
            if (first_target.hasOwnProperty(elem)) {  // считаю крен
                result["x_axis_flt_arr"].push(
                    (first_target[elem]['dx'] - second_target[elem]['dx']) /
                    (r + (first_target[elem]['dy'] - second_target[elem]['dy']) )
                )
                result['labels_str_arr'].push(first_target[elem]['timestamp'].slice(0, 16))
            }
        }


        return result
    }
}

let chart_content_disposition = async () => {
    await getTags().then(res => {
        const values = compose_arrays(res);
        chart(values['x_axis_flt_arr'], values['y_axis_flt_arr'], values['labels_str_arr'])
    })
}

let set_default_input_values = async () => {
    let current_date = new Date();
    document.getElementById('dates_range_from').valueAsDate = current_date;
    document.getElementById('dates_range_to').valueAsDate = current_date;
    document.getElementById('dates_range_to').valueAsDate = current_date;

    let formatted_date = `${current_date.getFullYear()}-${current_date.getMonth() + 1}-${current_date.getDate()}`;

    current_selections['file_date_from'] = formatted_date;
    current_selections['file_date_to'] = formatted_date;

}

let m_buttons_disposition_by_data_mode = async () => {
    let template_name = {
        false: 'targets-template',
        true: 'kren-template'
    }[current_selections['data_mode']]

    let feed_template = document.getElementById(template_name).content;
    let feed_template_node = document.importNode(feed_template, true);
    let m_buttons_div_element = document.getElementById("m-buttons");
    m_buttons_div_element.innerHTML = ''
    m_buttons_div_element.appendChild(feed_template_node);
}

let button_click_event_listener = async (current_selection, target) => {
    switch (target) {
        case 'data_mode':
            current_selections['data_mode'] = document.getElementById('target-visualization-mode').checked;
            await m_buttons_disposition_by_data_mode()
            break;
        case 'm_button':
            document.getElementById(current_selections['m_button']).classList.remove("active")
            current_selections['m_button'] = current_selection;
            document.getElementById(current_selection).classList.add("active")
            break;
        case 'm_button_kren':
            document.getElementById(current_selections['m_button_kren'][0]).classList.remove("active")
            current_selections['m_button_kren'] = current_selection
            document.getElementById(current_selection[0]).classList.add("active")
            break;
        case 'date_filter':
            current_selections['file_date_from'] = document.getElementById('dates_range_from').value
            current_selections['file_date_to'] = document.getElementById('dates_range_to').value
            break;
        default:
            break;
    }
    await chart_content_disposition()
}


let download_file_by_date_range = async () => {
    current_selections['file_date_from'] = document.getElementById('dates_range_from').value
    current_selections['file_date_to'] = document.getElementById('dates_range_to').value

    await getTags().then(res => {
        let headers = {
            target_id: "Id метки",
            timestamp: "Время создания метрики",
            dx: "Смещение по Оси X",
            dy: "Смещение по Оси Y",
            skox: "СКО по Оси X",
            skoy: "СКО по Оси Y"
        };

        let itemsFormatted = []

        for (let item in res) {
            if (res.hasOwnProperty(item)) {
                const unpacked_obj = res[item]
                itemsFormatted.push({
                    target_id: unpacked_obj.target_id,
                    timestamp: unpacked_obj.timestamp,
                    dx: unpacked_obj.dx,
                    dy: unpacked_obj.dy,
                    skox: unpacked_obj.skox,
                    skoy: unpacked_obj.skoy
                });
            }
        }

        let fileName = 'Targets';

        exportCSVFile(headers, itemsFormatted, fileName);
    })
}

let subscribe_email = async () => {
    let Url = root_url + "api/v1/mailing/";

    let Headers = {
      'Authorization': 'Bearer ' + get_cookie("access")
    }

    let response = await fetch(Url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: Headers,
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
    })

    const btn = document.getElementById("email-subscription");
    const resultMsg = document.getElementById("success-message");

    btn.classList.remove("mb-3");
    btn.classList.add("mb-1");

    if (response.ok) {
      resultMsg.textContent = "Рассылка подключена!";
      resultMsg.style.lineHeight = "20px";
      resultMsg.classList.add("mb-2");
    } else {
      resultMsg.textContent = "Ошибка подключения рассылки.";
      resultMsg.style.lineHeight = "20px";
      resultMsg.classList.add("mb-2");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    if (get_cookie("access") === null && get_cookie("refresh") !== null) {
        await updateAccessToken();
    }
    await m_buttons_disposition_by_data_mode()
    await set_default_input_values();
    await chart_content_disposition();
});