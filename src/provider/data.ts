/* import { DataProvider, BaseRecord, GetListParams, GetListResponse } from "@refinedev/core";

const mockSubjects = [
	{
		id: "1",
		coursecode: "CS101",
		name: "Introduction to Computer Science",
		departement: "Computer Science",
		description: "Foundations of programming, algorithms, and computational thinking.",
	},
	{
		id: "2",
		coursecode: "MATH221",
		name: "Linear Algebra",
		departement: "Mathematics",
		description: "Vector spaces, matrices, eigenvalues, and applications to data.",
	},
	{
		id: "3",
		coursecode: "BIO150",
		name: "Principles of Biology",
		departement: "Biology",
		description: "Cell structure, genetics, evolution, and basic lab methods.",
	},
];

export const dataProvider: DataProvider = {
	getList: async <TData extends BaseRecord = BaseRecord>(
		{ resource }: GetListParams,
	): Promise<GetListResponse<TData>> => {
		if (resource !== "subjects") {
			return { data: [] as TData[], total: 0 };
		}
		return {
			data: mockSubjects as unknown as TData[],
			total: mockSubjects.length,
		};
	},
	getOne: async () => {
		throw new Error("This function is not present in mock");
	},
	create: async () => {
		throw new Error("This function is not present in mock");
	},
	update: async () => {
		throw new Error("This function is not present in mock");
	},
	deleteOne: async () => {
		throw new Error("This function is not present in mock");
	},
	getApiUrl: () => "", // mock implementation
}; */
import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse } from "@/types";
import { CreateDataProviderOptions, createDataProvider } from "@refinedev/rest";

const options:CreateDataProviderOptions ={
	getList: {
		getEndpoint: (resource) => resource.resource,
		buildQueryParams :async({resource,pagination,filters}) => {
			const page =pagination?.currentPage ?? 1;
			const pageSize = pagination?.pageSize ?? 10;

			const params:Record<string,string|number> = {page,limit:pageSize};

			filters?.forEach((filter) => {
				const field = 'field' in filter ? filter.field : '';
				const value =String(filter.value);

				if(resource === 'subjects') {
					if(field === 'departement') params.departement = value;
					if(field === 'name'|| field === 'code') params.search = value;
				}
		})
		return params;
	},



		mapResponse: async (response) => {
			const payload:ListResponse = await response.json();
			return payload.data ?? [];
	},
	getTotalCount:async (response)=> {
	const payload:ListResponse = await response.json();
	return payload.pagination?.total ??payload.data?.length ?? 0;
	}
}
}
const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider }