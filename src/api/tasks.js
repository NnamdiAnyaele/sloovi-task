import axios from "helpers/axios";

export async function deleteTask(task_id, comapany_id) {
	console.log({ task_id, comapany_id });
	const url = `/task/lead_465c14d0e99e4972b6b21ffecf3dd691/${task_id}?company_id=${comapany_id}`;
	const { data } = await axios.delete(url, {});
	return data;
}

export async function updateTask(task_id, comapany_id, payload) {
	const url = `/task/lead_465c14d0e99e4972b6b21ffecf3dd691/${task_id}?company_id=${comapany_id}`;
	const { data } = await axios.put(url, payload);
	return data;
}

export async function getTask(task_id, comapany_id) {
	const url = `/task/lead_465c14d0e99e4972b6b21ffecf3dd691/${task_id}?company_id=${comapany_id}`;
	const { data } = await axios.get(url);
	return data;
}

export async function createTask(company_id, payload) {
	const url = `/task/lead_465c14d0e99e4972b6b21ffecf3dd691?company_id=${company_id}`;
	const { data } = await axios.post(url, payload);
	return data;
}
