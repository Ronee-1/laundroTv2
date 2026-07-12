import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Branch
 *
 */
export type BranchModel = runtime.Types.Result.DefaultSelection<Prisma.$BranchPayload>;
export type AggregateBranch = {
    _count: BranchCountAggregateOutputType | null;
    _avg: BranchAvgAggregateOutputType | null;
    _sum: BranchSumAggregateOutputType | null;
    _min: BranchMinAggregateOutputType | null;
    _max: BranchMaxAggregateOutputType | null;
};
export type BranchAvgAggregateOutputType = {
    latitude: number | null;
    longitude: number | null;
    kuota_harian: number | null;
    kuota_terpakai: number | null;
    omzet: number | null;
};
export type BranchSumAggregateOutputType = {
    latitude: number | null;
    longitude: number | null;
    kuota_harian: number | null;
    kuota_terpakai: number | null;
    omzet: number | null;
};
export type BranchMinAggregateOutputType = {
    id_cabang: string | null;
    nama_cabang: string | null;
    alamat: string | null;
    latitude: number | null;
    longitude: number | null;
    kuota_harian: number | null;
    kuota_terpakai: number | null;
    is_active: boolean | null;
    omzet: number | null;
    wilayah: string | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type BranchMaxAggregateOutputType = {
    id_cabang: string | null;
    nama_cabang: string | null;
    alamat: string | null;
    latitude: number | null;
    longitude: number | null;
    kuota_harian: number | null;
    kuota_terpakai: number | null;
    is_active: boolean | null;
    omzet: number | null;
    wilayah: string | null;
    created_at: Date | null;
    updated_at: Date | null;
};
export type BranchCountAggregateOutputType = {
    id_cabang: number;
    nama_cabang: number;
    alamat: number;
    latitude: number;
    longitude: number;
    kuota_harian: number;
    kuota_terpakai: number;
    is_active: number;
    omzet: number;
    wilayah: number;
    created_at: number;
    updated_at: number;
    _all: number;
};
export type BranchAvgAggregateInputType = {
    latitude?: true;
    longitude?: true;
    kuota_harian?: true;
    kuota_terpakai?: true;
    omzet?: true;
};
export type BranchSumAggregateInputType = {
    latitude?: true;
    longitude?: true;
    kuota_harian?: true;
    kuota_terpakai?: true;
    omzet?: true;
};
export type BranchMinAggregateInputType = {
    id_cabang?: true;
    nama_cabang?: true;
    alamat?: true;
    latitude?: true;
    longitude?: true;
    kuota_harian?: true;
    kuota_terpakai?: true;
    is_active?: true;
    omzet?: true;
    wilayah?: true;
    created_at?: true;
    updated_at?: true;
};
export type BranchMaxAggregateInputType = {
    id_cabang?: true;
    nama_cabang?: true;
    alamat?: true;
    latitude?: true;
    longitude?: true;
    kuota_harian?: true;
    kuota_terpakai?: true;
    is_active?: true;
    omzet?: true;
    wilayah?: true;
    created_at?: true;
    updated_at?: true;
};
export type BranchCountAggregateInputType = {
    id_cabang?: true;
    nama_cabang?: true;
    alamat?: true;
    latitude?: true;
    longitude?: true;
    kuota_harian?: true;
    kuota_terpakai?: true;
    is_active?: true;
    omzet?: true;
    wilayah?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
};
export type BranchAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Branch to aggregate.
     */
    where?: Prisma.BranchWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Branches to fetch.
     */
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.BranchWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Branches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Branches.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Branches
    **/
    _count?: true | BranchCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: BranchAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: BranchSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: BranchMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: BranchMaxAggregateInputType;
};
export type GetBranchAggregateType<T extends BranchAggregateArgs> = {
    [P in keyof T & keyof AggregateBranch]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBranch[P]> : Prisma.GetScalarType<T[P], AggregateBranch[P]>;
};
export type BranchGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithAggregationInput | Prisma.BranchOrderByWithAggregationInput[];
    by: Prisma.BranchScalarFieldEnum[] | Prisma.BranchScalarFieldEnum;
    having?: Prisma.BranchScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BranchCountAggregateInputType | true;
    _avg?: BranchAvgAggregateInputType;
    _sum?: BranchSumAggregateInputType;
    _min?: BranchMinAggregateInputType;
    _max?: BranchMaxAggregateInputType;
};
export type BranchGroupByOutputType = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian: number;
    kuota_terpakai: number;
    is_active: boolean;
    omzet: number;
    wilayah: string;
    created_at: Date;
    updated_at: Date;
    _count: BranchCountAggregateOutputType | null;
    _avg: BranchAvgAggregateOutputType | null;
    _sum: BranchSumAggregateOutputType | null;
    _min: BranchMinAggregateOutputType | null;
    _max: BranchMaxAggregateOutputType | null;
};
export type GetBranchGroupByPayload<T extends BranchGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BranchGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BranchGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BranchGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BranchGroupByOutputType[P]>;
}>>;
export type BranchWhereInput = {
    AND?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    OR?: Prisma.BranchWhereInput[];
    NOT?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    id_cabang?: Prisma.StringFilter<"Branch"> | string;
    nama_cabang?: Prisma.StringFilter<"Branch"> | string;
    alamat?: Prisma.StringFilter<"Branch"> | string;
    latitude?: Prisma.FloatFilter<"Branch"> | number;
    longitude?: Prisma.FloatFilter<"Branch"> | number;
    kuota_harian?: Prisma.IntFilter<"Branch"> | number;
    kuota_terpakai?: Prisma.IntFilter<"Branch"> | number;
    is_active?: Prisma.BoolFilter<"Branch"> | boolean;
    omzet?: Prisma.FloatFilter<"Branch"> | number;
    wilayah?: Prisma.StringFilter<"Branch"> | string;
    created_at?: Prisma.DateTimeFilter<"Branch"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Branch"> | Date | string;
    cashbook_entries?: Prisma.CashBookEntryListRelationFilter;
    couriers?: Prisma.CourierListRelationFilter;
    orders?: Prisma.OrderListRelationFilter;
    expenses?: Prisma.ExpenseListRelationFilter;
    monthly_budgets?: Prisma.MonthlyBudgetListRelationFilter;
    inventory_items?: Prisma.InventoryItemListRelationFilter;
    reconciliations?: Prisma.ReconciliationLogListRelationFilter;
    restock_requests?: Prisma.RestockRequestListRelationFilter;
    logistics_logs?: Prisma.LogisticsLogListRelationFilter;
    customers?: Prisma.CustomerListRelationFilter;
    users?: Prisma.UserListRelationFilter;
};
export type BranchOrderByWithRelationInput = {
    id_cabang?: Prisma.SortOrder;
    nama_cabang?: Prisma.SortOrder;
    alamat?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    kuota_harian?: Prisma.SortOrder;
    kuota_terpakai?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    omzet?: Prisma.SortOrder;
    wilayah?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    cashbook_entries?: Prisma.CashBookEntryOrderByRelationAggregateInput;
    couriers?: Prisma.CourierOrderByRelationAggregateInput;
    orders?: Prisma.OrderOrderByRelationAggregateInput;
    expenses?: Prisma.ExpenseOrderByRelationAggregateInput;
    monthly_budgets?: Prisma.MonthlyBudgetOrderByRelationAggregateInput;
    inventory_items?: Prisma.InventoryItemOrderByRelationAggregateInput;
    reconciliations?: Prisma.ReconciliationLogOrderByRelationAggregateInput;
    restock_requests?: Prisma.RestockRequestOrderByRelationAggregateInput;
    logistics_logs?: Prisma.LogisticsLogOrderByRelationAggregateInput;
    customers?: Prisma.CustomerOrderByRelationAggregateInput;
    users?: Prisma.UserOrderByRelationAggregateInput;
};
export type BranchWhereUniqueInput = Prisma.AtLeast<{
    id_cabang?: string;
    AND?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    OR?: Prisma.BranchWhereInput[];
    NOT?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    nama_cabang?: Prisma.StringFilter<"Branch"> | string;
    alamat?: Prisma.StringFilter<"Branch"> | string;
    latitude?: Prisma.FloatFilter<"Branch"> | number;
    longitude?: Prisma.FloatFilter<"Branch"> | number;
    kuota_harian?: Prisma.IntFilter<"Branch"> | number;
    kuota_terpakai?: Prisma.IntFilter<"Branch"> | number;
    is_active?: Prisma.BoolFilter<"Branch"> | boolean;
    omzet?: Prisma.FloatFilter<"Branch"> | number;
    wilayah?: Prisma.StringFilter<"Branch"> | string;
    created_at?: Prisma.DateTimeFilter<"Branch"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"Branch"> | Date | string;
    cashbook_entries?: Prisma.CashBookEntryListRelationFilter;
    couriers?: Prisma.CourierListRelationFilter;
    orders?: Prisma.OrderListRelationFilter;
    expenses?: Prisma.ExpenseListRelationFilter;
    monthly_budgets?: Prisma.MonthlyBudgetListRelationFilter;
    inventory_items?: Prisma.InventoryItemListRelationFilter;
    reconciliations?: Prisma.ReconciliationLogListRelationFilter;
    restock_requests?: Prisma.RestockRequestListRelationFilter;
    logistics_logs?: Prisma.LogisticsLogListRelationFilter;
    customers?: Prisma.CustomerListRelationFilter;
    users?: Prisma.UserListRelationFilter;
}, "id_cabang">;
export type BranchOrderByWithAggregationInput = {
    id_cabang?: Prisma.SortOrder;
    nama_cabang?: Prisma.SortOrder;
    alamat?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    kuota_harian?: Prisma.SortOrder;
    kuota_terpakai?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    omzet?: Prisma.SortOrder;
    wilayah?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    _count?: Prisma.BranchCountOrderByAggregateInput;
    _avg?: Prisma.BranchAvgOrderByAggregateInput;
    _max?: Prisma.BranchMaxOrderByAggregateInput;
    _min?: Prisma.BranchMinOrderByAggregateInput;
    _sum?: Prisma.BranchSumOrderByAggregateInput;
};
export type BranchScalarWhereWithAggregatesInput = {
    AND?: Prisma.BranchScalarWhereWithAggregatesInput | Prisma.BranchScalarWhereWithAggregatesInput[];
    OR?: Prisma.BranchScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BranchScalarWhereWithAggregatesInput | Prisma.BranchScalarWhereWithAggregatesInput[];
    id_cabang?: Prisma.StringWithAggregatesFilter<"Branch"> | string;
    nama_cabang?: Prisma.StringWithAggregatesFilter<"Branch"> | string;
    alamat?: Prisma.StringWithAggregatesFilter<"Branch"> | string;
    latitude?: Prisma.FloatWithAggregatesFilter<"Branch"> | number;
    longitude?: Prisma.FloatWithAggregatesFilter<"Branch"> | number;
    kuota_harian?: Prisma.IntWithAggregatesFilter<"Branch"> | number;
    kuota_terpakai?: Prisma.IntWithAggregatesFilter<"Branch"> | number;
    is_active?: Prisma.BoolWithAggregatesFilter<"Branch"> | boolean;
    omzet?: Prisma.FloatWithAggregatesFilter<"Branch"> | number;
    wilayah?: Prisma.StringWithAggregatesFilter<"Branch"> | string;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"Branch"> | Date | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<"Branch"> | Date | string;
};
export type BranchCreateInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemUncheckedCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestUncheckedCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchUpdateInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUncheckedUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUncheckedUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateManyInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
};
export type BranchUpdateManyMutationInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BranchUncheckedUpdateManyInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BranchNullableScalarRelationFilter = {
    is?: Prisma.BranchWhereInput | null;
    isNot?: Prisma.BranchWhereInput | null;
};
export type BranchCountOrderByAggregateInput = {
    id_cabang?: Prisma.SortOrder;
    nama_cabang?: Prisma.SortOrder;
    alamat?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    kuota_harian?: Prisma.SortOrder;
    kuota_terpakai?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    omzet?: Prisma.SortOrder;
    wilayah?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type BranchAvgOrderByAggregateInput = {
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    kuota_harian?: Prisma.SortOrder;
    kuota_terpakai?: Prisma.SortOrder;
    omzet?: Prisma.SortOrder;
};
export type BranchMaxOrderByAggregateInput = {
    id_cabang?: Prisma.SortOrder;
    nama_cabang?: Prisma.SortOrder;
    alamat?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    kuota_harian?: Prisma.SortOrder;
    kuota_terpakai?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    omzet?: Prisma.SortOrder;
    wilayah?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type BranchMinOrderByAggregateInput = {
    id_cabang?: Prisma.SortOrder;
    nama_cabang?: Prisma.SortOrder;
    alamat?: Prisma.SortOrder;
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    kuota_harian?: Prisma.SortOrder;
    kuota_terpakai?: Prisma.SortOrder;
    is_active?: Prisma.SortOrder;
    omzet?: Prisma.SortOrder;
    wilayah?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type BranchSumOrderByAggregateInput = {
    latitude?: Prisma.SortOrder;
    longitude?: Prisma.SortOrder;
    kuota_harian?: Prisma.SortOrder;
    kuota_terpakai?: Prisma.SortOrder;
    omzet?: Prisma.SortOrder;
};
export type BranchScalarRelationFilter = {
    is?: Prisma.BranchWhereInput;
    isNot?: Prisma.BranchWhereInput;
};
export type BranchCreateNestedOneWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutUsersInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutUsersInput;
    upsert?: Prisma.BranchUpsertWithoutUsersInput;
    disconnect?: Prisma.BranchWhereInput | boolean;
    delete?: Prisma.BranchWhereInput | boolean;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutUsersInput, Prisma.BranchUpdateWithoutUsersInput>, Prisma.BranchUncheckedUpdateWithoutUsersInput>;
};
export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type BranchCreateNestedOneWithoutCashbook_entriesInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutCashbook_entriesInput, Prisma.BranchUncheckedCreateWithoutCashbook_entriesInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutCashbook_entriesInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutCashbook_entriesNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutCashbook_entriesInput, Prisma.BranchUncheckedCreateWithoutCashbook_entriesInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutCashbook_entriesInput;
    upsert?: Prisma.BranchUpsertWithoutCashbook_entriesInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutCashbook_entriesInput, Prisma.BranchUpdateWithoutCashbook_entriesInput>, Prisma.BranchUncheckedUpdateWithoutCashbook_entriesInput>;
};
export type BranchCreateNestedOneWithoutCouriersInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutCouriersInput, Prisma.BranchUncheckedCreateWithoutCouriersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutCouriersInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutCouriersNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutCouriersInput, Prisma.BranchUncheckedCreateWithoutCouriersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutCouriersInput;
    upsert?: Prisma.BranchUpsertWithoutCouriersInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutCouriersInput, Prisma.BranchUpdateWithoutCouriersInput>, Prisma.BranchUncheckedUpdateWithoutCouriersInput>;
};
export type BranchCreateNestedOneWithoutOrdersInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutOrdersInput, Prisma.BranchUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutOrdersInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutOrdersInput, Prisma.BranchUncheckedCreateWithoutOrdersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutOrdersInput;
    upsert?: Prisma.BranchUpsertWithoutOrdersInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutOrdersInput, Prisma.BranchUpdateWithoutOrdersInput>, Prisma.BranchUncheckedUpdateWithoutOrdersInput>;
};
export type BranchCreateNestedOneWithoutExpensesInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutExpensesInput, Prisma.BranchUncheckedCreateWithoutExpensesInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutExpensesInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutExpensesNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutExpensesInput, Prisma.BranchUncheckedCreateWithoutExpensesInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutExpensesInput;
    upsert?: Prisma.BranchUpsertWithoutExpensesInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutExpensesInput, Prisma.BranchUpdateWithoutExpensesInput>, Prisma.BranchUncheckedUpdateWithoutExpensesInput>;
};
export type BranchCreateNestedOneWithoutMonthly_budgetsInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutMonthly_budgetsInput, Prisma.BranchUncheckedCreateWithoutMonthly_budgetsInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutMonthly_budgetsInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutMonthly_budgetsNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutMonthly_budgetsInput, Prisma.BranchUncheckedCreateWithoutMonthly_budgetsInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutMonthly_budgetsInput;
    upsert?: Prisma.BranchUpsertWithoutMonthly_budgetsInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutMonthly_budgetsInput, Prisma.BranchUpdateWithoutMonthly_budgetsInput>, Prisma.BranchUncheckedUpdateWithoutMonthly_budgetsInput>;
};
export type BranchCreateNestedOneWithoutInventory_itemsInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutInventory_itemsInput, Prisma.BranchUncheckedCreateWithoutInventory_itemsInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutInventory_itemsInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutInventory_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutInventory_itemsInput, Prisma.BranchUncheckedCreateWithoutInventory_itemsInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutInventory_itemsInput;
    upsert?: Prisma.BranchUpsertWithoutInventory_itemsInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutInventory_itemsInput, Prisma.BranchUpdateWithoutInventory_itemsInput>, Prisma.BranchUncheckedUpdateWithoutInventory_itemsInput>;
};
export type BranchCreateNestedOneWithoutReconciliationsInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutReconciliationsInput, Prisma.BranchUncheckedCreateWithoutReconciliationsInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutReconciliationsInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutReconciliationsNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutReconciliationsInput, Prisma.BranchUncheckedCreateWithoutReconciliationsInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutReconciliationsInput;
    upsert?: Prisma.BranchUpsertWithoutReconciliationsInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutReconciliationsInput, Prisma.BranchUpdateWithoutReconciliationsInput>, Prisma.BranchUncheckedUpdateWithoutReconciliationsInput>;
};
export type BranchCreateNestedOneWithoutRestock_requestsInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutRestock_requestsInput, Prisma.BranchUncheckedCreateWithoutRestock_requestsInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutRestock_requestsInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutRestock_requestsNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutRestock_requestsInput, Prisma.BranchUncheckedCreateWithoutRestock_requestsInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutRestock_requestsInput;
    upsert?: Prisma.BranchUpsertWithoutRestock_requestsInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutRestock_requestsInput, Prisma.BranchUpdateWithoutRestock_requestsInput>, Prisma.BranchUncheckedUpdateWithoutRestock_requestsInput>;
};
export type BranchCreateNestedOneWithoutLogistics_logsInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutLogistics_logsInput, Prisma.BranchUncheckedCreateWithoutLogistics_logsInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutLogistics_logsInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutLogistics_logsNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutLogistics_logsInput, Prisma.BranchUncheckedCreateWithoutLogistics_logsInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutLogistics_logsInput;
    upsert?: Prisma.BranchUpsertWithoutLogistics_logsInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutLogistics_logsInput, Prisma.BranchUpdateWithoutLogistics_logsInput>, Prisma.BranchUncheckedUpdateWithoutLogistics_logsInput>;
};
export type BranchCreateNestedOneWithoutCustomersInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutCustomersInput, Prisma.BranchUncheckedCreateWithoutCustomersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutCustomersInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneRequiredWithoutCustomersNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutCustomersInput, Prisma.BranchUncheckedCreateWithoutCustomersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutCustomersInput;
    upsert?: Prisma.BranchUpsertWithoutCustomersInput;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutCustomersInput, Prisma.BranchUpdateWithoutCustomersInput>, Prisma.BranchUncheckedUpdateWithoutCustomersInput>;
};
export type BranchCreateWithoutUsersInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutUsersInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemUncheckedCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestUncheckedCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutUsersInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
};
export type BranchUpsertWithoutUsersInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutUsersInput, Prisma.BranchUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutUsersInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutUsersInput, Prisma.BranchUncheckedUpdateWithoutUsersInput>;
};
export type BranchUpdateWithoutUsersInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutUsersInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUncheckedUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUncheckedUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutCashbook_entriesInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    couriers?: Prisma.CourierCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutCashbook_entriesInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    couriers?: Prisma.CourierUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemUncheckedCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestUncheckedCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutCashbook_entriesInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutCashbook_entriesInput, Prisma.BranchUncheckedCreateWithoutCashbook_entriesInput>;
};
export type BranchUpsertWithoutCashbook_entriesInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutCashbook_entriesInput, Prisma.BranchUncheckedUpdateWithoutCashbook_entriesInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutCashbook_entriesInput, Prisma.BranchUncheckedCreateWithoutCashbook_entriesInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutCashbook_entriesInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutCashbook_entriesInput, Prisma.BranchUncheckedUpdateWithoutCashbook_entriesInput>;
};
export type BranchUpdateWithoutCashbook_entriesInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    couriers?: Prisma.CourierUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutCashbook_entriesInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    couriers?: Prisma.CourierUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUncheckedUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUncheckedUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutCouriersInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutCouriersInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemUncheckedCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestUncheckedCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutCouriersInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutCouriersInput, Prisma.BranchUncheckedCreateWithoutCouriersInput>;
};
export type BranchUpsertWithoutCouriersInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutCouriersInput, Prisma.BranchUncheckedUpdateWithoutCouriersInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutCouriersInput, Prisma.BranchUncheckedCreateWithoutCouriersInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutCouriersInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutCouriersInput, Prisma.BranchUncheckedUpdateWithoutCouriersInput>;
};
export type BranchUpdateWithoutCouriersInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutCouriersInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUncheckedUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUncheckedUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutOrdersInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutOrdersInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemUncheckedCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestUncheckedCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutOrdersInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutOrdersInput, Prisma.BranchUncheckedCreateWithoutOrdersInput>;
};
export type BranchUpsertWithoutOrdersInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutOrdersInput, Prisma.BranchUncheckedUpdateWithoutOrdersInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutOrdersInput, Prisma.BranchUncheckedCreateWithoutOrdersInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutOrdersInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutOrdersInput, Prisma.BranchUncheckedUpdateWithoutOrdersInput>;
};
export type BranchUpdateWithoutOrdersInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutOrdersInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUncheckedUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUncheckedUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutExpensesInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutExpensesInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemUncheckedCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestUncheckedCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutExpensesInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutExpensesInput, Prisma.BranchUncheckedCreateWithoutExpensesInput>;
};
export type BranchUpsertWithoutExpensesInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutExpensesInput, Prisma.BranchUncheckedUpdateWithoutExpensesInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutExpensesInput, Prisma.BranchUncheckedCreateWithoutExpensesInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutExpensesInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutExpensesInput, Prisma.BranchUncheckedUpdateWithoutExpensesInput>;
};
export type BranchUpdateWithoutExpensesInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutExpensesInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUncheckedUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUncheckedUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutMonthly_budgetsInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutMonthly_budgetsInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemUncheckedCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestUncheckedCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutMonthly_budgetsInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutMonthly_budgetsInput, Prisma.BranchUncheckedCreateWithoutMonthly_budgetsInput>;
};
export type BranchUpsertWithoutMonthly_budgetsInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutMonthly_budgetsInput, Prisma.BranchUncheckedUpdateWithoutMonthly_budgetsInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutMonthly_budgetsInput, Prisma.BranchUncheckedCreateWithoutMonthly_budgetsInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutMonthly_budgetsInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutMonthly_budgetsInput, Prisma.BranchUncheckedUpdateWithoutMonthly_budgetsInput>;
};
export type BranchUpdateWithoutMonthly_budgetsInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutMonthly_budgetsInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUncheckedUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUncheckedUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutInventory_itemsInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutInventory_itemsInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestUncheckedCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutInventory_itemsInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutInventory_itemsInput, Prisma.BranchUncheckedCreateWithoutInventory_itemsInput>;
};
export type BranchUpsertWithoutInventory_itemsInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutInventory_itemsInput, Prisma.BranchUncheckedUpdateWithoutInventory_itemsInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutInventory_itemsInput, Prisma.BranchUncheckedCreateWithoutInventory_itemsInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutInventory_itemsInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutInventory_itemsInput, Prisma.BranchUncheckedUpdateWithoutInventory_itemsInput>;
};
export type BranchUpdateWithoutInventory_itemsInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutInventory_itemsInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUncheckedUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutReconciliationsInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutReconciliationsInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemUncheckedCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestUncheckedCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutReconciliationsInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutReconciliationsInput, Prisma.BranchUncheckedCreateWithoutReconciliationsInput>;
};
export type BranchUpsertWithoutReconciliationsInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutReconciliationsInput, Prisma.BranchUncheckedUpdateWithoutReconciliationsInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutReconciliationsInput, Prisma.BranchUncheckedCreateWithoutReconciliationsInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutReconciliationsInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutReconciliationsInput, Prisma.BranchUncheckedUpdateWithoutReconciliationsInput>;
};
export type BranchUpdateWithoutReconciliationsInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutReconciliationsInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUncheckedUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUncheckedUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutRestock_requestsInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutRestock_requestsInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemUncheckedCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutRestock_requestsInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutRestock_requestsInput, Prisma.BranchUncheckedCreateWithoutRestock_requestsInput>;
};
export type BranchUpsertWithoutRestock_requestsInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutRestock_requestsInput, Prisma.BranchUncheckedUpdateWithoutRestock_requestsInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutRestock_requestsInput, Prisma.BranchUncheckedCreateWithoutRestock_requestsInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutRestock_requestsInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutRestock_requestsInput, Prisma.BranchUncheckedUpdateWithoutRestock_requestsInput>;
};
export type BranchUpdateWithoutRestock_requestsInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutRestock_requestsInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUncheckedUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutLogistics_logsInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutLogistics_logsInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemUncheckedCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestUncheckedCreateNestedManyWithoutBranchInput;
    customers?: Prisma.CustomerUncheckedCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutLogistics_logsInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutLogistics_logsInput, Prisma.BranchUncheckedCreateWithoutLogistics_logsInput>;
};
export type BranchUpsertWithoutLogistics_logsInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutLogistics_logsInput, Prisma.BranchUncheckedUpdateWithoutLogistics_logsInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutLogistics_logsInput, Prisma.BranchUncheckedCreateWithoutLogistics_logsInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutLogistics_logsInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutLogistics_logsInput, Prisma.BranchUncheckedUpdateWithoutLogistics_logsInput>;
};
export type BranchUpdateWithoutLogistics_logsInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutLogistics_logsInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUncheckedUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUncheckedUpdateManyWithoutBranchNestedInput;
    customers?: Prisma.CustomerUncheckedUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutCustomersInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutCustomersInput = {
    id_cabang: string;
    nama_cabang: string;
    alamat: string;
    latitude: number;
    longitude: number;
    kuota_harian?: number;
    kuota_terpakai?: number;
    is_active?: boolean;
    omzet?: number;
    wilayah: string;
    created_at?: Date | string;
    updated_at?: Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedCreateNestedManyWithoutBranchInput;
    couriers?: Prisma.CourierUncheckedCreateNestedManyWithoutBranchInput;
    orders?: Prisma.OrderUncheckedCreateNestedManyWithoutBranchInput;
    expenses?: Prisma.ExpenseUncheckedCreateNestedManyWithoutBranchInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedCreateNestedManyWithoutBranchInput;
    inventory_items?: Prisma.InventoryItemUncheckedCreateNestedManyWithoutBranchInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedCreateNestedManyWithoutBranchInput;
    restock_requests?: Prisma.RestockRequestUncheckedCreateNestedManyWithoutBranchInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedCreateNestedManyWithoutBranchInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutCustomersInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutCustomersInput, Prisma.BranchUncheckedCreateWithoutCustomersInput>;
};
export type BranchUpsertWithoutCustomersInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutCustomersInput, Prisma.BranchUncheckedUpdateWithoutCustomersInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutCustomersInput, Prisma.BranchUncheckedCreateWithoutCustomersInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutCustomersInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutCustomersInput, Prisma.BranchUncheckedUpdateWithoutCustomersInput>;
};
export type BranchUpdateWithoutCustomersInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutCustomersInput = {
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    alamat?: Prisma.StringFieldUpdateOperationsInput | string;
    latitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    longitude?: Prisma.FloatFieldUpdateOperationsInput | number;
    kuota_harian?: Prisma.IntFieldUpdateOperationsInput | number;
    kuota_terpakai?: Prisma.IntFieldUpdateOperationsInput | number;
    is_active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    omzet?: Prisma.FloatFieldUpdateOperationsInput | number;
    wilayah?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cashbook_entries?: Prisma.CashBookEntryUncheckedUpdateManyWithoutBranchNestedInput;
    couriers?: Prisma.CourierUncheckedUpdateManyWithoutBranchNestedInput;
    orders?: Prisma.OrderUncheckedUpdateManyWithoutBranchNestedInput;
    expenses?: Prisma.ExpenseUncheckedUpdateManyWithoutBranchNestedInput;
    monthly_budgets?: Prisma.MonthlyBudgetUncheckedUpdateManyWithoutBranchNestedInput;
    inventory_items?: Prisma.InventoryItemUncheckedUpdateManyWithoutBranchNestedInput;
    reconciliations?: Prisma.ReconciliationLogUncheckedUpdateManyWithoutBranchNestedInput;
    restock_requests?: Prisma.RestockRequestUncheckedUpdateManyWithoutBranchNestedInput;
    logistics_logs?: Prisma.LogisticsLogUncheckedUpdateManyWithoutBranchNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
};
/**
 * Count Type BranchCountOutputType
 */
export type BranchCountOutputType = {
    cashbook_entries: number;
    couriers: number;
    orders: number;
    expenses: number;
    monthly_budgets: number;
    inventory_items: number;
    reconciliations: number;
    restock_requests: number;
    logistics_logs: number;
    customers: number;
    users: number;
};
export type BranchCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    cashbook_entries?: boolean | BranchCountOutputTypeCountCashbook_entriesArgs;
    couriers?: boolean | BranchCountOutputTypeCountCouriersArgs;
    orders?: boolean | BranchCountOutputTypeCountOrdersArgs;
    expenses?: boolean | BranchCountOutputTypeCountExpensesArgs;
    monthly_budgets?: boolean | BranchCountOutputTypeCountMonthly_budgetsArgs;
    inventory_items?: boolean | BranchCountOutputTypeCountInventory_itemsArgs;
    reconciliations?: boolean | BranchCountOutputTypeCountReconciliationsArgs;
    restock_requests?: boolean | BranchCountOutputTypeCountRestock_requestsArgs;
    logistics_logs?: boolean | BranchCountOutputTypeCountLogistics_logsArgs;
    customers?: boolean | BranchCountOutputTypeCountCustomersArgs;
    users?: boolean | BranchCountOutputTypeCountUsersArgs;
};
/**
 * BranchCountOutputType without action
 */
export type BranchCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BranchCountOutputType
     */
    select?: Prisma.BranchCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * BranchCountOutputType without action
 */
export type BranchCountOutputTypeCountCashbook_entriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CashBookEntryWhereInput;
};
/**
 * BranchCountOutputType without action
 */
export type BranchCountOutputTypeCountCouriersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourierWhereInput;
};
/**
 * BranchCountOutputType without action
 */
export type BranchCountOutputTypeCountOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderWhereInput;
};
/**
 * BranchCountOutputType without action
 */
export type BranchCountOutputTypeCountExpensesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ExpenseWhereInput;
};
/**
 * BranchCountOutputType without action
 */
export type BranchCountOutputTypeCountMonthly_budgetsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MonthlyBudgetWhereInput;
};
/**
 * BranchCountOutputType without action
 */
export type BranchCountOutputTypeCountInventory_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryItemWhereInput;
};
/**
 * BranchCountOutputType without action
 */
export type BranchCountOutputTypeCountReconciliationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReconciliationLogWhereInput;
};
/**
 * BranchCountOutputType without action
 */
export type BranchCountOutputTypeCountRestock_requestsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RestockRequestWhereInput;
};
/**
 * BranchCountOutputType without action
 */
export type BranchCountOutputTypeCountLogistics_logsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LogisticsLogWhereInput;
};
/**
 * BranchCountOutputType without action
 */
export type BranchCountOutputTypeCountCustomersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerWhereInput;
};
/**
 * BranchCountOutputType without action
 */
export type BranchCountOutputTypeCountUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
export type BranchSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id_cabang?: boolean;
    nama_cabang?: boolean;
    alamat?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    kuota_harian?: boolean;
    kuota_terpakai?: boolean;
    is_active?: boolean;
    omzet?: boolean;
    wilayah?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    cashbook_entries?: boolean | Prisma.Branch$cashbook_entriesArgs<ExtArgs>;
    couriers?: boolean | Prisma.Branch$couriersArgs<ExtArgs>;
    orders?: boolean | Prisma.Branch$ordersArgs<ExtArgs>;
    expenses?: boolean | Prisma.Branch$expensesArgs<ExtArgs>;
    monthly_budgets?: boolean | Prisma.Branch$monthly_budgetsArgs<ExtArgs>;
    inventory_items?: boolean | Prisma.Branch$inventory_itemsArgs<ExtArgs>;
    reconciliations?: boolean | Prisma.Branch$reconciliationsArgs<ExtArgs>;
    restock_requests?: boolean | Prisma.Branch$restock_requestsArgs<ExtArgs>;
    logistics_logs?: boolean | Prisma.Branch$logistics_logsArgs<ExtArgs>;
    customers?: boolean | Prisma.Branch$customersArgs<ExtArgs>;
    users?: boolean | Prisma.Branch$usersArgs<ExtArgs>;
    _count?: boolean | Prisma.BranchCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["branch"]>;
export type BranchSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id_cabang?: boolean;
    nama_cabang?: boolean;
    alamat?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    kuota_harian?: boolean;
    kuota_terpakai?: boolean;
    is_active?: boolean;
    omzet?: boolean;
    wilayah?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
}, ExtArgs["result"]["branch"]>;
export type BranchSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id_cabang?: boolean;
    nama_cabang?: boolean;
    alamat?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    kuota_harian?: boolean;
    kuota_terpakai?: boolean;
    is_active?: boolean;
    omzet?: boolean;
    wilayah?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
}, ExtArgs["result"]["branch"]>;
export type BranchSelectScalar = {
    id_cabang?: boolean;
    nama_cabang?: boolean;
    alamat?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    kuota_harian?: boolean;
    kuota_terpakai?: boolean;
    is_active?: boolean;
    omzet?: boolean;
    wilayah?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
};
export type BranchOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id_cabang" | "nama_cabang" | "alamat" | "latitude" | "longitude" | "kuota_harian" | "kuota_terpakai" | "is_active" | "omzet" | "wilayah" | "created_at" | "updated_at", ExtArgs["result"]["branch"]>;
export type BranchInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    cashbook_entries?: boolean | Prisma.Branch$cashbook_entriesArgs<ExtArgs>;
    couriers?: boolean | Prisma.Branch$couriersArgs<ExtArgs>;
    orders?: boolean | Prisma.Branch$ordersArgs<ExtArgs>;
    expenses?: boolean | Prisma.Branch$expensesArgs<ExtArgs>;
    monthly_budgets?: boolean | Prisma.Branch$monthly_budgetsArgs<ExtArgs>;
    inventory_items?: boolean | Prisma.Branch$inventory_itemsArgs<ExtArgs>;
    reconciliations?: boolean | Prisma.Branch$reconciliationsArgs<ExtArgs>;
    restock_requests?: boolean | Prisma.Branch$restock_requestsArgs<ExtArgs>;
    logistics_logs?: boolean | Prisma.Branch$logistics_logsArgs<ExtArgs>;
    customers?: boolean | Prisma.Branch$customersArgs<ExtArgs>;
    users?: boolean | Prisma.Branch$usersArgs<ExtArgs>;
    _count?: boolean | Prisma.BranchCountOutputTypeDefaultArgs<ExtArgs>;
};
export type BranchIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type BranchIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $BranchPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Branch";
    objects: {
        cashbook_entries: Prisma.$CashBookEntryPayload<ExtArgs>[];
        couriers: Prisma.$CourierPayload<ExtArgs>[];
        orders: Prisma.$OrderPayload<ExtArgs>[];
        expenses: Prisma.$ExpensePayload<ExtArgs>[];
        monthly_budgets: Prisma.$MonthlyBudgetPayload<ExtArgs>[];
        inventory_items: Prisma.$InventoryItemPayload<ExtArgs>[];
        reconciliations: Prisma.$ReconciliationLogPayload<ExtArgs>[];
        restock_requests: Prisma.$RestockRequestPayload<ExtArgs>[];
        logistics_logs: Prisma.$LogisticsLogPayload<ExtArgs>[];
        customers: Prisma.$CustomerPayload<ExtArgs>[];
        users: Prisma.$UserPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id_cabang: string;
        nama_cabang: string;
        alamat: string;
        latitude: number;
        longitude: number;
        kuota_harian: number;
        kuota_terpakai: number;
        is_active: boolean;
        omzet: number;
        wilayah: string;
        created_at: Date;
        updated_at: Date;
    }, ExtArgs["result"]["branch"]>;
    composites: {};
};
export type BranchGetPayload<S extends boolean | null | undefined | BranchDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BranchPayload, S>;
export type BranchCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BranchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BranchCountAggregateInputType | true;
};
export interface BranchDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Branch'];
        meta: {
            name: 'Branch';
        };
    };
    /**
     * Find zero or one Branch that matches the filter.
     * @param {BranchFindUniqueArgs} args - Arguments to find a Branch
     * @example
     * // Get one Branch
     * const branch = await prisma.branch.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BranchFindUniqueArgs>(args: Prisma.SelectSubset<T, BranchFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Branch that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BranchFindUniqueOrThrowArgs} args - Arguments to find a Branch
     * @example
     * // Get one Branch
     * const branch = await prisma.branch.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BranchFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BranchFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Branch that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchFindFirstArgs} args - Arguments to find a Branch
     * @example
     * // Get one Branch
     * const branch = await prisma.branch.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BranchFindFirstArgs>(args?: Prisma.SelectSubset<T, BranchFindFirstArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Branch that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchFindFirstOrThrowArgs} args - Arguments to find a Branch
     * @example
     * // Get one Branch
     * const branch = await prisma.branch.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BranchFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BranchFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Branches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Branches
     * const branches = await prisma.branch.findMany()
     *
     * // Get first 10 Branches
     * const branches = await prisma.branch.findMany({ take: 10 })
     *
     * // Only select the `id_cabang`
     * const branchWithId_cabangOnly = await prisma.branch.findMany({ select: { id_cabang: true } })
     *
     */
    findMany<T extends BranchFindManyArgs>(args?: Prisma.SelectSubset<T, BranchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Branch.
     * @param {BranchCreateArgs} args - Arguments to create a Branch.
     * @example
     * // Create one Branch
     * const Branch = await prisma.branch.create({
     *   data: {
     *     // ... data to create a Branch
     *   }
     * })
     *
     */
    create<T extends BranchCreateArgs>(args: Prisma.SelectSubset<T, BranchCreateArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Branches.
     * @param {BranchCreateManyArgs} args - Arguments to create many Branches.
     * @example
     * // Create many Branches
     * const branch = await prisma.branch.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends BranchCreateManyArgs>(args?: Prisma.SelectSubset<T, BranchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Branches and returns the data saved in the database.
     * @param {BranchCreateManyAndReturnArgs} args - Arguments to create many Branches.
     * @example
     * // Create many Branches
     * const branch = await prisma.branch.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Branches and only return the `id_cabang`
     * const branchWithId_cabangOnly = await prisma.branch.createManyAndReturn({
     *   select: { id_cabang: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends BranchCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BranchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Branch.
     * @param {BranchDeleteArgs} args - Arguments to delete one Branch.
     * @example
     * // Delete one Branch
     * const Branch = await prisma.branch.delete({
     *   where: {
     *     // ... filter to delete one Branch
     *   }
     * })
     *
     */
    delete<T extends BranchDeleteArgs>(args: Prisma.SelectSubset<T, BranchDeleteArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Branch.
     * @param {BranchUpdateArgs} args - Arguments to update one Branch.
     * @example
     * // Update one Branch
     * const branch = await prisma.branch.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends BranchUpdateArgs>(args: Prisma.SelectSubset<T, BranchUpdateArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Branches.
     * @param {BranchDeleteManyArgs} args - Arguments to filter Branches to delete.
     * @example
     * // Delete a few Branches
     * const { count } = await prisma.branch.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends BranchDeleteManyArgs>(args?: Prisma.SelectSubset<T, BranchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Branches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Branches
     * const branch = await prisma.branch.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends BranchUpdateManyArgs>(args: Prisma.SelectSubset<T, BranchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Branches and returns the data updated in the database.
     * @param {BranchUpdateManyAndReturnArgs} args - Arguments to update many Branches.
     * @example
     * // Update many Branches
     * const branch = await prisma.branch.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Branches and only return the `id_cabang`
     * const branchWithId_cabangOnly = await prisma.branch.updateManyAndReturn({
     *   select: { id_cabang: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends BranchUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BranchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Branch.
     * @param {BranchUpsertArgs} args - Arguments to update or create a Branch.
     * @example
     * // Update or create a Branch
     * const branch = await prisma.branch.upsert({
     *   create: {
     *     // ... data to create a Branch
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Branch we want to update
     *   }
     * })
     */
    upsert<T extends BranchUpsertArgs>(args: Prisma.SelectSubset<T, BranchUpsertArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Branches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchCountArgs} args - Arguments to filter Branches to count.
     * @example
     * // Count the number of Branches
     * const count = await prisma.branch.count({
     *   where: {
     *     // ... the filter for the Branches we want to count
     *   }
     * })
    **/
    count<T extends BranchCountArgs>(args?: Prisma.Subset<T, BranchCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BranchCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Branch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BranchAggregateArgs>(args: Prisma.Subset<T, BranchAggregateArgs>): Prisma.PrismaPromise<GetBranchAggregateType<T>>;
    /**
     * Group by Branch.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BranchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends BranchGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BranchGroupByArgs['orderBy'];
    } : {
        orderBy?: BranchGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BranchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBranchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Branch model
     */
    readonly fields: BranchFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Branch.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__BranchClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    cashbook_entries<T extends Prisma.Branch$cashbook_entriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$cashbook_entriesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CashBookEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    couriers<T extends Prisma.Branch$couriersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$couriersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourierPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    orders<T extends Prisma.Branch$ordersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    expenses<T extends Prisma.Branch$expensesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$expensesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ExpensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    monthly_budgets<T extends Prisma.Branch$monthly_budgetsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$monthly_budgetsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MonthlyBudgetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    inventory_items<T extends Prisma.Branch$inventory_itemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$inventory_itemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    reconciliations<T extends Prisma.Branch$reconciliationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$reconciliationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReconciliationLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    restock_requests<T extends Prisma.Branch$restock_requestsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$restock_requestsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RestockRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    logistics_logs<T extends Prisma.Branch$logistics_logsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$logistics_logsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LogisticsLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    customers<T extends Prisma.Branch$customersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$customersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    users<T extends Prisma.Branch$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$usersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the Branch model
 */
export interface BranchFieldRefs {
    readonly id_cabang: Prisma.FieldRef<"Branch", 'String'>;
    readonly nama_cabang: Prisma.FieldRef<"Branch", 'String'>;
    readonly alamat: Prisma.FieldRef<"Branch", 'String'>;
    readonly latitude: Prisma.FieldRef<"Branch", 'Float'>;
    readonly longitude: Prisma.FieldRef<"Branch", 'Float'>;
    readonly kuota_harian: Prisma.FieldRef<"Branch", 'Int'>;
    readonly kuota_terpakai: Prisma.FieldRef<"Branch", 'Int'>;
    readonly is_active: Prisma.FieldRef<"Branch", 'Boolean'>;
    readonly omzet: Prisma.FieldRef<"Branch", 'Float'>;
    readonly wilayah: Prisma.FieldRef<"Branch", 'String'>;
    readonly created_at: Prisma.FieldRef<"Branch", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"Branch", 'DateTime'>;
}
/**
 * Branch findUnique
 */
export type BranchFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: Prisma.BranchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Branch
     */
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BranchInclude<ExtArgs> | null;
    /**
     * Filter, which Branch to fetch.
     */
    where: Prisma.BranchWhereUniqueInput;
};
/**
 * Branch findUniqueOrThrow
 */
export type BranchFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: Prisma.BranchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Branch
     */
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BranchInclude<ExtArgs> | null;
    /**
     * Filter, which Branch to fetch.
     */
    where: Prisma.BranchWhereUniqueInput;
};
/**
 * Branch findFirst
 */
export type BranchFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: Prisma.BranchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Branch
     */
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BranchInclude<ExtArgs> | null;
    /**
     * Filter, which Branch to fetch.
     */
    where?: Prisma.BranchWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Branches to fetch.
     */
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Branches.
     */
    cursor?: Prisma.BranchWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Branches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Branches.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Branches.
     */
    distinct?: Prisma.BranchScalarFieldEnum | Prisma.BranchScalarFieldEnum[];
};
/**
 * Branch findFirstOrThrow
 */
export type BranchFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: Prisma.BranchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Branch
     */
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BranchInclude<ExtArgs> | null;
    /**
     * Filter, which Branch to fetch.
     */
    where?: Prisma.BranchWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Branches to fetch.
     */
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Branches.
     */
    cursor?: Prisma.BranchWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Branches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Branches.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Branches.
     */
    distinct?: Prisma.BranchScalarFieldEnum | Prisma.BranchScalarFieldEnum[];
};
/**
 * Branch findMany
 */
export type BranchFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: Prisma.BranchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Branch
     */
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BranchInclude<ExtArgs> | null;
    /**
     * Filter, which Branches to fetch.
     */
    where?: Prisma.BranchWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Branches to fetch.
     */
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Branches.
     */
    cursor?: Prisma.BranchWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Branches from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Branches.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Branches.
     */
    distinct?: Prisma.BranchScalarFieldEnum | Prisma.BranchScalarFieldEnum[];
};
/**
 * Branch create
 */
export type BranchCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: Prisma.BranchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Branch
     */
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BranchInclude<ExtArgs> | null;
    /**
     * The data needed to create a Branch.
     */
    data: Prisma.XOR<Prisma.BranchCreateInput, Prisma.BranchUncheckedCreateInput>;
};
/**
 * Branch createMany
 */
export type BranchCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Branches.
     */
    data: Prisma.BranchCreateManyInput | Prisma.BranchCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Branch createManyAndReturn
 */
export type BranchCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: Prisma.BranchSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Branch
     */
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    /**
     * The data used to create many Branches.
     */
    data: Prisma.BranchCreateManyInput | Prisma.BranchCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Branch update
 */
export type BranchUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: Prisma.BranchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Branch
     */
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BranchInclude<ExtArgs> | null;
    /**
     * The data needed to update a Branch.
     */
    data: Prisma.XOR<Prisma.BranchUpdateInput, Prisma.BranchUncheckedUpdateInput>;
    /**
     * Choose, which Branch to update.
     */
    where: Prisma.BranchWhereUniqueInput;
};
/**
 * Branch updateMany
 */
export type BranchUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Branches.
     */
    data: Prisma.XOR<Prisma.BranchUpdateManyMutationInput, Prisma.BranchUncheckedUpdateManyInput>;
    /**
     * Filter which Branches to update
     */
    where?: Prisma.BranchWhereInput;
    /**
     * Limit how many Branches to update.
     */
    limit?: number;
};
/**
 * Branch updateManyAndReturn
 */
export type BranchUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: Prisma.BranchSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Branch
     */
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    /**
     * The data used to update Branches.
     */
    data: Prisma.XOR<Prisma.BranchUpdateManyMutationInput, Prisma.BranchUncheckedUpdateManyInput>;
    /**
     * Filter which Branches to update
     */
    where?: Prisma.BranchWhereInput;
    /**
     * Limit how many Branches to update.
     */
    limit?: number;
};
/**
 * Branch upsert
 */
export type BranchUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: Prisma.BranchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Branch
     */
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BranchInclude<ExtArgs> | null;
    /**
     * The filter to search for the Branch to update in case it exists.
     */
    where: Prisma.BranchWhereUniqueInput;
    /**
     * In case the Branch found by the `where` argument doesn't exist, create a new Branch with this data.
     */
    create: Prisma.XOR<Prisma.BranchCreateInput, Prisma.BranchUncheckedCreateInput>;
    /**
     * In case the Branch was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.BranchUpdateInput, Prisma.BranchUncheckedUpdateInput>;
};
/**
 * Branch delete
 */
export type BranchDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: Prisma.BranchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Branch
     */
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BranchInclude<ExtArgs> | null;
    /**
     * Filter which Branch to delete.
     */
    where: Prisma.BranchWhereUniqueInput;
};
/**
 * Branch deleteMany
 */
export type BranchDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Branches to delete
     */
    where?: Prisma.BranchWhereInput;
    /**
     * Limit how many Branches to delete.
     */
    limit?: number;
};
/**
 * Branch.cashbook_entries
 */
export type Branch$cashbook_entriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashBookEntry
     */
    select?: Prisma.CashBookEntrySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the CashBookEntry
     */
    omit?: Prisma.CashBookEntryOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.CashBookEntryInclude<ExtArgs> | null;
    where?: Prisma.CashBookEntryWhereInput;
    orderBy?: Prisma.CashBookEntryOrderByWithRelationInput | Prisma.CashBookEntryOrderByWithRelationInput[];
    cursor?: Prisma.CashBookEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CashBookEntryScalarFieldEnum | Prisma.CashBookEntryScalarFieldEnum[];
};
/**
 * Branch.couriers
 */
export type Branch$couriersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Courier
     */
    select?: Prisma.CourierSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Courier
     */
    omit?: Prisma.CourierOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.CourierInclude<ExtArgs> | null;
    where?: Prisma.CourierWhereInput;
    orderBy?: Prisma.CourierOrderByWithRelationInput | Prisma.CourierOrderByWithRelationInput[];
    cursor?: Prisma.CourierWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourierScalarFieldEnum | Prisma.CourierScalarFieldEnum[];
};
/**
 * Branch.orders
 */
export type Branch$ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: Prisma.OrderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Order
     */
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OrderInclude<ExtArgs> | null;
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithRelationInput | Prisma.OrderOrderByWithRelationInput[];
    cursor?: Prisma.OrderWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderScalarFieldEnum | Prisma.OrderScalarFieldEnum[];
};
/**
 * Branch.expenses
 */
export type Branch$expensesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Expense
     */
    select?: Prisma.ExpenseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Expense
     */
    omit?: Prisma.ExpenseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ExpenseInclude<ExtArgs> | null;
    where?: Prisma.ExpenseWhereInput;
    orderBy?: Prisma.ExpenseOrderByWithRelationInput | Prisma.ExpenseOrderByWithRelationInput[];
    cursor?: Prisma.ExpenseWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ExpenseScalarFieldEnum | Prisma.ExpenseScalarFieldEnum[];
};
/**
 * Branch.monthly_budgets
 */
export type Branch$monthly_budgetsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MonthlyBudget
     */
    select?: Prisma.MonthlyBudgetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MonthlyBudget
     */
    omit?: Prisma.MonthlyBudgetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MonthlyBudgetInclude<ExtArgs> | null;
    where?: Prisma.MonthlyBudgetWhereInput;
    orderBy?: Prisma.MonthlyBudgetOrderByWithRelationInput | Prisma.MonthlyBudgetOrderByWithRelationInput[];
    cursor?: Prisma.MonthlyBudgetWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MonthlyBudgetScalarFieldEnum | Prisma.MonthlyBudgetScalarFieldEnum[];
};
/**
 * Branch.inventory_items
 */
export type Branch$inventory_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: Prisma.InventoryItemSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: Prisma.InventoryItemOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InventoryItemInclude<ExtArgs> | null;
    where?: Prisma.InventoryItemWhereInput;
    orderBy?: Prisma.InventoryItemOrderByWithRelationInput | Prisma.InventoryItemOrderByWithRelationInput[];
    cursor?: Prisma.InventoryItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InventoryItemScalarFieldEnum | Prisma.InventoryItemScalarFieldEnum[];
};
/**
 * Branch.reconciliations
 */
export type Branch$reconciliationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationLog
     */
    select?: Prisma.ReconciliationLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ReconciliationLog
     */
    omit?: Prisma.ReconciliationLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReconciliationLogInclude<ExtArgs> | null;
    where?: Prisma.ReconciliationLogWhereInput;
    orderBy?: Prisma.ReconciliationLogOrderByWithRelationInput | Prisma.ReconciliationLogOrderByWithRelationInput[];
    cursor?: Prisma.ReconciliationLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ReconciliationLogScalarFieldEnum | Prisma.ReconciliationLogScalarFieldEnum[];
};
/**
 * Branch.restock_requests
 */
export type Branch$restock_requestsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestockRequest
     */
    select?: Prisma.RestockRequestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RestockRequest
     */
    omit?: Prisma.RestockRequestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RestockRequestInclude<ExtArgs> | null;
    where?: Prisma.RestockRequestWhereInput;
    orderBy?: Prisma.RestockRequestOrderByWithRelationInput | Prisma.RestockRequestOrderByWithRelationInput[];
    cursor?: Prisma.RestockRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RestockRequestScalarFieldEnum | Prisma.RestockRequestScalarFieldEnum[];
};
/**
 * Branch.logistics_logs
 */
export type Branch$logistics_logsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogisticsLog
     */
    select?: Prisma.LogisticsLogSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the LogisticsLog
     */
    omit?: Prisma.LogisticsLogOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.LogisticsLogInclude<ExtArgs> | null;
    where?: Prisma.LogisticsLogWhereInput;
    orderBy?: Prisma.LogisticsLogOrderByWithRelationInput | Prisma.LogisticsLogOrderByWithRelationInput[];
    cursor?: Prisma.LogisticsLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LogisticsLogScalarFieldEnum | Prisma.LogisticsLogScalarFieldEnum[];
};
/**
 * Branch.customers
 */
export type Branch$customersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Customer
     */
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where?: Prisma.CustomerWhereInput;
    orderBy?: Prisma.CustomerOrderByWithRelationInput | Prisma.CustomerOrderByWithRelationInput[];
    cursor?: Prisma.CustomerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerScalarFieldEnum | Prisma.CustomerScalarFieldEnum[];
};
/**
 * Branch.users
 */
export type Branch$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * Branch without action
 */
export type BranchDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Branch
     */
    select?: Prisma.BranchSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Branch
     */
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.BranchInclude<ExtArgs> | null;
};
//# sourceMappingURL=Branch.d.ts.map