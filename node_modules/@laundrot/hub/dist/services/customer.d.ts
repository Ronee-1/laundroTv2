export interface CreateCustomerInput {
    id_cabang: string;
    nama: string;
    whatsapp: string;
    alamat_maps: string;
    google_maps_url?: string;
}
export interface CustomerResponse {
    id_pelanggan: string;
    id_cabang: string;
    nama: string;
    whatsapp: string;
    alamat_maps: string;
    google_maps_url?: string;
    created_at: Date;
}
export declare function createCustomer(data: CreateCustomerInput): Promise<CustomerResponse>;
export declare function getCustomersByBranch(id_cabang: string): Promise<CustomerResponse[]>;
export declare function getAllCustomers(): Promise<CustomerResponse[]>;
export declare function getCustomerById(id_pelanggan: string): Promise<CustomerResponse | null>;
export declare function updateCustomer(id_pelanggan: string, data: Partial<CreateCustomerInput>): Promise<CustomerResponse | null>;
export declare function deleteCustomer(id_pelanggan: string): Promise<boolean>;
export declare function searchCustomers(id_cabang: string, query: string): Promise<CustomerResponse[]>;
//# sourceMappingURL=customer.d.ts.map