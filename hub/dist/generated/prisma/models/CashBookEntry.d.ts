import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model CashBookEntry
 *
 */
export type CashBookEntryModel = runtime.Types.Result.DefaultSelection<Prisma.$CashBookEntryPayload>;
export type AggregateCashBookEntry = {
    _count: CashBookEntryCountAggregateOutputType | null;
    _avg: CashBookEntryAvgAggregateOutputType | null;
    _sum: CashBookEntrySumAggregateOutputType | null;
    _min: CashBookEntryMinAggregateOutputType | null;
    _max: CashBookEntryMaxAggregateOutputType | null;
};
export type CashBookEntryAvgAggregateOutputType = {
    nominal: number | null;
};
export type CashBookEntrySumAggregateOutputType = {
    nominal: number | null;
};
export type CashBookEntryMinAggregateOutputType = {
    id_jurnal: string | null;
    id_cabang: string | null;
    id_transaksi: string | null;
    nominal: number | null;
    tipe: string | null;
    deskripsi: string | null;
    tanggal_jurnal: Date | null;
    created_at: Date | null;
};
export type CashBookEntryMaxAggregateOutputType = {
    id_jurnal: string | null;
    id_cabang: string | null;
    id_transaksi: string | null;
    nominal: number | null;
    tipe: string | null;
    deskripsi: string | null;
    tanggal_jurnal: Date | null;
    created_at: Date | null;
};
export type CashBookEntryCountAggregateOutputType = {
    id_jurnal: number;
    id_cabang: number;
    id_transaksi: number;
    nominal: number;
    tipe: number;
    deskripsi: number;
    tanggal_jurnal: number;
    created_at: number;
    _all: number;
};
export type CashBookEntryAvgAggregateInputType = {
    nominal?: true;
};
export type CashBookEntrySumAggregateInputType = {
    nominal?: true;
};
export type CashBookEntryMinAggregateInputType = {
    id_jurnal?: true;
    id_cabang?: true;
    id_transaksi?: true;
    nominal?: true;
    tipe?: true;
    deskripsi?: true;
    tanggal_jurnal?: true;
    created_at?: true;
};
export type CashBookEntryMaxAggregateInputType = {
    id_jurnal?: true;
    id_cabang?: true;
    id_transaksi?: true;
    nominal?: true;
    tipe?: true;
    deskripsi?: true;
    tanggal_jurnal?: true;
    created_at?: true;
};
export type CashBookEntryCountAggregateInputType = {
    id_jurnal?: true;
    id_cabang?: true;
    id_transaksi?: true;
    nominal?: true;
    tipe?: true;
    deskripsi?: true;
    tanggal_jurnal?: true;
    created_at?: true;
    _all?: true;
};
export type CashBookEntryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which CashBookEntry to aggregate.
     */
    where?: Prisma.CashBookEntryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CashBookEntries to fetch.
     */
    orderBy?: Prisma.CashBookEntryOrderByWithRelationInput | Prisma.CashBookEntryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.CashBookEntryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CashBookEntries from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CashBookEntries.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned CashBookEntries
    **/
    _count?: true | CashBookEntryCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: CashBookEntryAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: CashBookEntrySumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: CashBookEntryMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: CashBookEntryMaxAggregateInputType;
};
export type GetCashBookEntryAggregateType<T extends CashBookEntryAggregateArgs> = {
    [P in keyof T & keyof AggregateCashBookEntry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCashBookEntry[P]> : Prisma.GetScalarType<T[P], AggregateCashBookEntry[P]>;
};
export type CashBookEntryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CashBookEntryWhereInput;
    orderBy?: Prisma.CashBookEntryOrderByWithAggregationInput | Prisma.CashBookEntryOrderByWithAggregationInput[];
    by: Prisma.CashBookEntryScalarFieldEnum[] | Prisma.CashBookEntryScalarFieldEnum;
    having?: Prisma.CashBookEntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CashBookEntryCountAggregateInputType | true;
    _avg?: CashBookEntryAvgAggregateInputType;
    _sum?: CashBookEntrySumAggregateInputType;
    _min?: CashBookEntryMinAggregateInputType;
    _max?: CashBookEntryMaxAggregateInputType;
};
export type CashBookEntryGroupByOutputType = {
    id_jurnal: string;
    id_cabang: string;
    id_transaksi: string;
    nominal: number;
    tipe: string;
    deskripsi: string;
    tanggal_jurnal: Date;
    created_at: Date;
    _count: CashBookEntryCountAggregateOutputType | null;
    _avg: CashBookEntryAvgAggregateOutputType | null;
    _sum: CashBookEntrySumAggregateOutputType | null;
    _min: CashBookEntryMinAggregateOutputType | null;
    _max: CashBookEntryMaxAggregateOutputType | null;
};
export type GetCashBookEntryGroupByPayload<T extends CashBookEntryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CashBookEntryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CashBookEntryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CashBookEntryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CashBookEntryGroupByOutputType[P]>;
}>>;
export type CashBookEntryWhereInput = {
    AND?: Prisma.CashBookEntryWhereInput | Prisma.CashBookEntryWhereInput[];
    OR?: Prisma.CashBookEntryWhereInput[];
    NOT?: Prisma.CashBookEntryWhereInput | Prisma.CashBookEntryWhereInput[];
    id_jurnal?: Prisma.StringFilter<"CashBookEntry"> | string;
    id_cabang?: Prisma.StringFilter<"CashBookEntry"> | string;
    id_transaksi?: Prisma.StringFilter<"CashBookEntry"> | string;
    nominal?: Prisma.FloatFilter<"CashBookEntry"> | number;
    tipe?: Prisma.StringFilter<"CashBookEntry"> | string;
    deskripsi?: Prisma.StringFilter<"CashBookEntry"> | string;
    tanggal_jurnal?: Prisma.DateTimeFilter<"CashBookEntry"> | Date | string;
    created_at?: Prisma.DateTimeFilter<"CashBookEntry"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
};
export type CashBookEntryOrderByWithRelationInput = {
    id_jurnal?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    id_transaksi?: Prisma.SortOrder;
    nominal?: Prisma.SortOrder;
    tipe?: Prisma.SortOrder;
    deskripsi?: Prisma.SortOrder;
    tanggal_jurnal?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    branch?: Prisma.BranchOrderByWithRelationInput;
};
export type CashBookEntryWhereUniqueInput = Prisma.AtLeast<{
    id_jurnal?: string;
    AND?: Prisma.CashBookEntryWhereInput | Prisma.CashBookEntryWhereInput[];
    OR?: Prisma.CashBookEntryWhereInput[];
    NOT?: Prisma.CashBookEntryWhereInput | Prisma.CashBookEntryWhereInput[];
    id_cabang?: Prisma.StringFilter<"CashBookEntry"> | string;
    id_transaksi?: Prisma.StringFilter<"CashBookEntry"> | string;
    nominal?: Prisma.FloatFilter<"CashBookEntry"> | number;
    tipe?: Prisma.StringFilter<"CashBookEntry"> | string;
    deskripsi?: Prisma.StringFilter<"CashBookEntry"> | string;
    tanggal_jurnal?: Prisma.DateTimeFilter<"CashBookEntry"> | Date | string;
    created_at?: Prisma.DateTimeFilter<"CashBookEntry"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
}, "id_jurnal">;
export type CashBookEntryOrderByWithAggregationInput = {
    id_jurnal?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    id_transaksi?: Prisma.SortOrder;
    nominal?: Prisma.SortOrder;
    tipe?: Prisma.SortOrder;
    deskripsi?: Prisma.SortOrder;
    tanggal_jurnal?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.CashBookEntryCountOrderByAggregateInput;
    _avg?: Prisma.CashBookEntryAvgOrderByAggregateInput;
    _max?: Prisma.CashBookEntryMaxOrderByAggregateInput;
    _min?: Prisma.CashBookEntryMinOrderByAggregateInput;
    _sum?: Prisma.CashBookEntrySumOrderByAggregateInput;
};
export type CashBookEntryScalarWhereWithAggregatesInput = {
    AND?: Prisma.CashBookEntryScalarWhereWithAggregatesInput | Prisma.CashBookEntryScalarWhereWithAggregatesInput[];
    OR?: Prisma.CashBookEntryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CashBookEntryScalarWhereWithAggregatesInput | Prisma.CashBookEntryScalarWhereWithAggregatesInput[];
    id_jurnal?: Prisma.StringWithAggregatesFilter<"CashBookEntry"> | string;
    id_cabang?: Prisma.StringWithAggregatesFilter<"CashBookEntry"> | string;
    id_transaksi?: Prisma.StringWithAggregatesFilter<"CashBookEntry"> | string;
    nominal?: Prisma.FloatWithAggregatesFilter<"CashBookEntry"> | number;
    tipe?: Prisma.StringWithAggregatesFilter<"CashBookEntry"> | string;
    deskripsi?: Prisma.StringWithAggregatesFilter<"CashBookEntry"> | string;
    tanggal_jurnal?: Prisma.DateTimeWithAggregatesFilter<"CashBookEntry"> | Date | string;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"CashBookEntry"> | Date | string;
};
export type CashBookEntryCreateInput = {
    id_jurnal?: string;
    id_transaksi: string;
    nominal: number;
    tipe: string;
    deskripsi: string;
    tanggal_jurnal?: Date | string;
    created_at?: Date | string;
    branch: Prisma.BranchCreateNestedOneWithoutCashbook_entriesInput;
};
export type CashBookEntryUncheckedCreateInput = {
    id_jurnal?: string;
    id_cabang: string;
    id_transaksi: string;
    nominal: number;
    tipe: string;
    deskripsi: string;
    tanggal_jurnal?: Date | string;
    created_at?: Date | string;
};
export type CashBookEntryUpdateInput = {
    id_jurnal?: Prisma.StringFieldUpdateOperationsInput | string;
    id_transaksi?: Prisma.StringFieldUpdateOperationsInput | string;
    nominal?: Prisma.FloatFieldUpdateOperationsInput | number;
    tipe?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    tanggal_jurnal?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneRequiredWithoutCashbook_entriesNestedInput;
};
export type CashBookEntryUncheckedUpdateInput = {
    id_jurnal?: Prisma.StringFieldUpdateOperationsInput | string;
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    id_transaksi?: Prisma.StringFieldUpdateOperationsInput | string;
    nominal?: Prisma.FloatFieldUpdateOperationsInput | number;
    tipe?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    tanggal_jurnal?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CashBookEntryCreateManyInput = {
    id_jurnal?: string;
    id_cabang: string;
    id_transaksi: string;
    nominal: number;
    tipe: string;
    deskripsi: string;
    tanggal_jurnal?: Date | string;
    created_at?: Date | string;
};
export type CashBookEntryUpdateManyMutationInput = {
    id_jurnal?: Prisma.StringFieldUpdateOperationsInput | string;
    id_transaksi?: Prisma.StringFieldUpdateOperationsInput | string;
    nominal?: Prisma.FloatFieldUpdateOperationsInput | number;
    tipe?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    tanggal_jurnal?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CashBookEntryUncheckedUpdateManyInput = {
    id_jurnal?: Prisma.StringFieldUpdateOperationsInput | string;
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    id_transaksi?: Prisma.StringFieldUpdateOperationsInput | string;
    nominal?: Prisma.FloatFieldUpdateOperationsInput | number;
    tipe?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    tanggal_jurnal?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CashBookEntryListRelationFilter = {
    every?: Prisma.CashBookEntryWhereInput;
    some?: Prisma.CashBookEntryWhereInput;
    none?: Prisma.CashBookEntryWhereInput;
};
export type CashBookEntryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CashBookEntryCountOrderByAggregateInput = {
    id_jurnal?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    id_transaksi?: Prisma.SortOrder;
    nominal?: Prisma.SortOrder;
    tipe?: Prisma.SortOrder;
    deskripsi?: Prisma.SortOrder;
    tanggal_jurnal?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type CashBookEntryAvgOrderByAggregateInput = {
    nominal?: Prisma.SortOrder;
};
export type CashBookEntryMaxOrderByAggregateInput = {
    id_jurnal?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    id_transaksi?: Prisma.SortOrder;
    nominal?: Prisma.SortOrder;
    tipe?: Prisma.SortOrder;
    deskripsi?: Prisma.SortOrder;
    tanggal_jurnal?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type CashBookEntryMinOrderByAggregateInput = {
    id_jurnal?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    id_transaksi?: Prisma.SortOrder;
    nominal?: Prisma.SortOrder;
    tipe?: Prisma.SortOrder;
    deskripsi?: Prisma.SortOrder;
    tanggal_jurnal?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type CashBookEntrySumOrderByAggregateInput = {
    nominal?: Prisma.SortOrder;
};
export type CashBookEntryCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.CashBookEntryCreateWithoutBranchInput, Prisma.CashBookEntryUncheckedCreateWithoutBranchInput> | Prisma.CashBookEntryCreateWithoutBranchInput[] | Prisma.CashBookEntryUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.CashBookEntryCreateOrConnectWithoutBranchInput | Prisma.CashBookEntryCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.CashBookEntryCreateManyBranchInputEnvelope;
    connect?: Prisma.CashBookEntryWhereUniqueInput | Prisma.CashBookEntryWhereUniqueInput[];
};
export type CashBookEntryUncheckedCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.CashBookEntryCreateWithoutBranchInput, Prisma.CashBookEntryUncheckedCreateWithoutBranchInput> | Prisma.CashBookEntryCreateWithoutBranchInput[] | Prisma.CashBookEntryUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.CashBookEntryCreateOrConnectWithoutBranchInput | Prisma.CashBookEntryCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.CashBookEntryCreateManyBranchInputEnvelope;
    connect?: Prisma.CashBookEntryWhereUniqueInput | Prisma.CashBookEntryWhereUniqueInput[];
};
export type CashBookEntryUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.CashBookEntryCreateWithoutBranchInput, Prisma.CashBookEntryUncheckedCreateWithoutBranchInput> | Prisma.CashBookEntryCreateWithoutBranchInput[] | Prisma.CashBookEntryUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.CashBookEntryCreateOrConnectWithoutBranchInput | Prisma.CashBookEntryCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.CashBookEntryUpsertWithWhereUniqueWithoutBranchInput | Prisma.CashBookEntryUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.CashBookEntryCreateManyBranchInputEnvelope;
    set?: Prisma.CashBookEntryWhereUniqueInput | Prisma.CashBookEntryWhereUniqueInput[];
    disconnect?: Prisma.CashBookEntryWhereUniqueInput | Prisma.CashBookEntryWhereUniqueInput[];
    delete?: Prisma.CashBookEntryWhereUniqueInput | Prisma.CashBookEntryWhereUniqueInput[];
    connect?: Prisma.CashBookEntryWhereUniqueInput | Prisma.CashBookEntryWhereUniqueInput[];
    update?: Prisma.CashBookEntryUpdateWithWhereUniqueWithoutBranchInput | Prisma.CashBookEntryUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.CashBookEntryUpdateManyWithWhereWithoutBranchInput | Prisma.CashBookEntryUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.CashBookEntryScalarWhereInput | Prisma.CashBookEntryScalarWhereInput[];
};
export type CashBookEntryUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.CashBookEntryCreateWithoutBranchInput, Prisma.CashBookEntryUncheckedCreateWithoutBranchInput> | Prisma.CashBookEntryCreateWithoutBranchInput[] | Prisma.CashBookEntryUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.CashBookEntryCreateOrConnectWithoutBranchInput | Prisma.CashBookEntryCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.CashBookEntryUpsertWithWhereUniqueWithoutBranchInput | Prisma.CashBookEntryUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.CashBookEntryCreateManyBranchInputEnvelope;
    set?: Prisma.CashBookEntryWhereUniqueInput | Prisma.CashBookEntryWhereUniqueInput[];
    disconnect?: Prisma.CashBookEntryWhereUniqueInput | Prisma.CashBookEntryWhereUniqueInput[];
    delete?: Prisma.CashBookEntryWhereUniqueInput | Prisma.CashBookEntryWhereUniqueInput[];
    connect?: Prisma.CashBookEntryWhereUniqueInput | Prisma.CashBookEntryWhereUniqueInput[];
    update?: Prisma.CashBookEntryUpdateWithWhereUniqueWithoutBranchInput | Prisma.CashBookEntryUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.CashBookEntryUpdateManyWithWhereWithoutBranchInput | Prisma.CashBookEntryUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.CashBookEntryScalarWhereInput | Prisma.CashBookEntryScalarWhereInput[];
};
export type CashBookEntryCreateWithoutBranchInput = {
    id_jurnal?: string;
    id_transaksi: string;
    nominal: number;
    tipe: string;
    deskripsi: string;
    tanggal_jurnal?: Date | string;
    created_at?: Date | string;
};
export type CashBookEntryUncheckedCreateWithoutBranchInput = {
    id_jurnal?: string;
    id_transaksi: string;
    nominal: number;
    tipe: string;
    deskripsi: string;
    tanggal_jurnal?: Date | string;
    created_at?: Date | string;
};
export type CashBookEntryCreateOrConnectWithoutBranchInput = {
    where: Prisma.CashBookEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.CashBookEntryCreateWithoutBranchInput, Prisma.CashBookEntryUncheckedCreateWithoutBranchInput>;
};
export type CashBookEntryCreateManyBranchInputEnvelope = {
    data: Prisma.CashBookEntryCreateManyBranchInput | Prisma.CashBookEntryCreateManyBranchInput[];
    skipDuplicates?: boolean;
};
export type CashBookEntryUpsertWithWhereUniqueWithoutBranchInput = {
    where: Prisma.CashBookEntryWhereUniqueInput;
    update: Prisma.XOR<Prisma.CashBookEntryUpdateWithoutBranchInput, Prisma.CashBookEntryUncheckedUpdateWithoutBranchInput>;
    create: Prisma.XOR<Prisma.CashBookEntryCreateWithoutBranchInput, Prisma.CashBookEntryUncheckedCreateWithoutBranchInput>;
};
export type CashBookEntryUpdateWithWhereUniqueWithoutBranchInput = {
    where: Prisma.CashBookEntryWhereUniqueInput;
    data: Prisma.XOR<Prisma.CashBookEntryUpdateWithoutBranchInput, Prisma.CashBookEntryUncheckedUpdateWithoutBranchInput>;
};
export type CashBookEntryUpdateManyWithWhereWithoutBranchInput = {
    where: Prisma.CashBookEntryScalarWhereInput;
    data: Prisma.XOR<Prisma.CashBookEntryUpdateManyMutationInput, Prisma.CashBookEntryUncheckedUpdateManyWithoutBranchInput>;
};
export type CashBookEntryScalarWhereInput = {
    AND?: Prisma.CashBookEntryScalarWhereInput | Prisma.CashBookEntryScalarWhereInput[];
    OR?: Prisma.CashBookEntryScalarWhereInput[];
    NOT?: Prisma.CashBookEntryScalarWhereInput | Prisma.CashBookEntryScalarWhereInput[];
    id_jurnal?: Prisma.StringFilter<"CashBookEntry"> | string;
    id_cabang?: Prisma.StringFilter<"CashBookEntry"> | string;
    id_transaksi?: Prisma.StringFilter<"CashBookEntry"> | string;
    nominal?: Prisma.FloatFilter<"CashBookEntry"> | number;
    tipe?: Prisma.StringFilter<"CashBookEntry"> | string;
    deskripsi?: Prisma.StringFilter<"CashBookEntry"> | string;
    tanggal_jurnal?: Prisma.DateTimeFilter<"CashBookEntry"> | Date | string;
    created_at?: Prisma.DateTimeFilter<"CashBookEntry"> | Date | string;
};
export type CashBookEntryCreateManyBranchInput = {
    id_jurnal?: string;
    id_transaksi: string;
    nominal: number;
    tipe: string;
    deskripsi: string;
    tanggal_jurnal?: Date | string;
    created_at?: Date | string;
};
export type CashBookEntryUpdateWithoutBranchInput = {
    id_jurnal?: Prisma.StringFieldUpdateOperationsInput | string;
    id_transaksi?: Prisma.StringFieldUpdateOperationsInput | string;
    nominal?: Prisma.FloatFieldUpdateOperationsInput | number;
    tipe?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    tanggal_jurnal?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CashBookEntryUncheckedUpdateWithoutBranchInput = {
    id_jurnal?: Prisma.StringFieldUpdateOperationsInput | string;
    id_transaksi?: Prisma.StringFieldUpdateOperationsInput | string;
    nominal?: Prisma.FloatFieldUpdateOperationsInput | number;
    tipe?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    tanggal_jurnal?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CashBookEntryUncheckedUpdateManyWithoutBranchInput = {
    id_jurnal?: Prisma.StringFieldUpdateOperationsInput | string;
    id_transaksi?: Prisma.StringFieldUpdateOperationsInput | string;
    nominal?: Prisma.FloatFieldUpdateOperationsInput | number;
    tipe?: Prisma.StringFieldUpdateOperationsInput | string;
    deskripsi?: Prisma.StringFieldUpdateOperationsInput | string;
    tanggal_jurnal?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CashBookEntrySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id_jurnal?: boolean;
    id_cabang?: boolean;
    id_transaksi?: boolean;
    nominal?: boolean;
    tipe?: boolean;
    deskripsi?: boolean;
    tanggal_jurnal?: boolean;
    created_at?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["cashBookEntry"]>;
export type CashBookEntrySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id_jurnal?: boolean;
    id_cabang?: boolean;
    id_transaksi?: boolean;
    nominal?: boolean;
    tipe?: boolean;
    deskripsi?: boolean;
    tanggal_jurnal?: boolean;
    created_at?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["cashBookEntry"]>;
export type CashBookEntrySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id_jurnal?: boolean;
    id_cabang?: boolean;
    id_transaksi?: boolean;
    nominal?: boolean;
    tipe?: boolean;
    deskripsi?: boolean;
    tanggal_jurnal?: boolean;
    created_at?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["cashBookEntry"]>;
export type CashBookEntrySelectScalar = {
    id_jurnal?: boolean;
    id_cabang?: boolean;
    id_transaksi?: boolean;
    nominal?: boolean;
    tipe?: boolean;
    deskripsi?: boolean;
    tanggal_jurnal?: boolean;
    created_at?: boolean;
};
export type CashBookEntryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id_jurnal" | "id_cabang" | "id_transaksi" | "nominal" | "tipe" | "deskripsi" | "tanggal_jurnal" | "created_at", ExtArgs["result"]["cashBookEntry"]>;
export type CashBookEntryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type CashBookEntryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type CashBookEntryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type $CashBookEntryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CashBookEntry";
    objects: {
        branch: Prisma.$BranchPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id_jurnal: string;
        id_cabang: string;
        id_transaksi: string;
        nominal: number;
        tipe: string;
        deskripsi: string;
        tanggal_jurnal: Date;
        created_at: Date;
    }, ExtArgs["result"]["cashBookEntry"]>;
    composites: {};
};
export type CashBookEntryGetPayload<S extends boolean | null | undefined | CashBookEntryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CashBookEntryPayload, S>;
export type CashBookEntryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CashBookEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CashBookEntryCountAggregateInputType | true;
};
export interface CashBookEntryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CashBookEntry'];
        meta: {
            name: 'CashBookEntry';
        };
    };
    /**
     * Find zero or one CashBookEntry that matches the filter.
     * @param {CashBookEntryFindUniqueArgs} args - Arguments to find a CashBookEntry
     * @example
     * // Get one CashBookEntry
     * const cashBookEntry = await prisma.cashBookEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CashBookEntryFindUniqueArgs>(args: Prisma.SelectSubset<T, CashBookEntryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CashBookEntryClient<runtime.Types.Result.GetResult<Prisma.$CashBookEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one CashBookEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CashBookEntryFindUniqueOrThrowArgs} args - Arguments to find a CashBookEntry
     * @example
     * // Get one CashBookEntry
     * const cashBookEntry = await prisma.cashBookEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CashBookEntryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CashBookEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CashBookEntryClient<runtime.Types.Result.GetResult<Prisma.$CashBookEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first CashBookEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashBookEntryFindFirstArgs} args - Arguments to find a CashBookEntry
     * @example
     * // Get one CashBookEntry
     * const cashBookEntry = await prisma.cashBookEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CashBookEntryFindFirstArgs>(args?: Prisma.SelectSubset<T, CashBookEntryFindFirstArgs<ExtArgs>>): Prisma.Prisma__CashBookEntryClient<runtime.Types.Result.GetResult<Prisma.$CashBookEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first CashBookEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashBookEntryFindFirstOrThrowArgs} args - Arguments to find a CashBookEntry
     * @example
     * // Get one CashBookEntry
     * const cashBookEntry = await prisma.cashBookEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CashBookEntryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CashBookEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CashBookEntryClient<runtime.Types.Result.GetResult<Prisma.$CashBookEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more CashBookEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashBookEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CashBookEntries
     * const cashBookEntries = await prisma.cashBookEntry.findMany()
     *
     * // Get first 10 CashBookEntries
     * const cashBookEntries = await prisma.cashBookEntry.findMany({ take: 10 })
     *
     * // Only select the `id_jurnal`
     * const cashBookEntryWithId_jurnalOnly = await prisma.cashBookEntry.findMany({ select: { id_jurnal: true } })
     *
     */
    findMany<T extends CashBookEntryFindManyArgs>(args?: Prisma.SelectSubset<T, CashBookEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CashBookEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a CashBookEntry.
     * @param {CashBookEntryCreateArgs} args - Arguments to create a CashBookEntry.
     * @example
     * // Create one CashBookEntry
     * const CashBookEntry = await prisma.cashBookEntry.create({
     *   data: {
     *     // ... data to create a CashBookEntry
     *   }
     * })
     *
     */
    create<T extends CashBookEntryCreateArgs>(args: Prisma.SelectSubset<T, CashBookEntryCreateArgs<ExtArgs>>): Prisma.Prisma__CashBookEntryClient<runtime.Types.Result.GetResult<Prisma.$CashBookEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many CashBookEntries.
     * @param {CashBookEntryCreateManyArgs} args - Arguments to create many CashBookEntries.
     * @example
     * // Create many CashBookEntries
     * const cashBookEntry = await prisma.cashBookEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends CashBookEntryCreateManyArgs>(args?: Prisma.SelectSubset<T, CashBookEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many CashBookEntries and returns the data saved in the database.
     * @param {CashBookEntryCreateManyAndReturnArgs} args - Arguments to create many CashBookEntries.
     * @example
     * // Create many CashBookEntries
     * const cashBookEntry = await prisma.cashBookEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many CashBookEntries and only return the `id_jurnal`
     * const cashBookEntryWithId_jurnalOnly = await prisma.cashBookEntry.createManyAndReturn({
     *   select: { id_jurnal: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends CashBookEntryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CashBookEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CashBookEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a CashBookEntry.
     * @param {CashBookEntryDeleteArgs} args - Arguments to delete one CashBookEntry.
     * @example
     * // Delete one CashBookEntry
     * const CashBookEntry = await prisma.cashBookEntry.delete({
     *   where: {
     *     // ... filter to delete one CashBookEntry
     *   }
     * })
     *
     */
    delete<T extends CashBookEntryDeleteArgs>(args: Prisma.SelectSubset<T, CashBookEntryDeleteArgs<ExtArgs>>): Prisma.Prisma__CashBookEntryClient<runtime.Types.Result.GetResult<Prisma.$CashBookEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one CashBookEntry.
     * @param {CashBookEntryUpdateArgs} args - Arguments to update one CashBookEntry.
     * @example
     * // Update one CashBookEntry
     * const cashBookEntry = await prisma.cashBookEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends CashBookEntryUpdateArgs>(args: Prisma.SelectSubset<T, CashBookEntryUpdateArgs<ExtArgs>>): Prisma.Prisma__CashBookEntryClient<runtime.Types.Result.GetResult<Prisma.$CashBookEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more CashBookEntries.
     * @param {CashBookEntryDeleteManyArgs} args - Arguments to filter CashBookEntries to delete.
     * @example
     * // Delete a few CashBookEntries
     * const { count } = await prisma.cashBookEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends CashBookEntryDeleteManyArgs>(args?: Prisma.SelectSubset<T, CashBookEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more CashBookEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashBookEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CashBookEntries
     * const cashBookEntry = await prisma.cashBookEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends CashBookEntryUpdateManyArgs>(args: Prisma.SelectSubset<T, CashBookEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more CashBookEntries and returns the data updated in the database.
     * @param {CashBookEntryUpdateManyAndReturnArgs} args - Arguments to update many CashBookEntries.
     * @example
     * // Update many CashBookEntries
     * const cashBookEntry = await prisma.cashBookEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more CashBookEntries and only return the `id_jurnal`
     * const cashBookEntryWithId_jurnalOnly = await prisma.cashBookEntry.updateManyAndReturn({
     *   select: { id_jurnal: true },
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
    updateManyAndReturn<T extends CashBookEntryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CashBookEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CashBookEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one CashBookEntry.
     * @param {CashBookEntryUpsertArgs} args - Arguments to update or create a CashBookEntry.
     * @example
     * // Update or create a CashBookEntry
     * const cashBookEntry = await prisma.cashBookEntry.upsert({
     *   create: {
     *     // ... data to create a CashBookEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CashBookEntry we want to update
     *   }
     * })
     */
    upsert<T extends CashBookEntryUpsertArgs>(args: Prisma.SelectSubset<T, CashBookEntryUpsertArgs<ExtArgs>>): Prisma.Prisma__CashBookEntryClient<runtime.Types.Result.GetResult<Prisma.$CashBookEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of CashBookEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashBookEntryCountArgs} args - Arguments to filter CashBookEntries to count.
     * @example
     * // Count the number of CashBookEntries
     * const count = await prisma.cashBookEntry.count({
     *   where: {
     *     // ... the filter for the CashBookEntries we want to count
     *   }
     * })
    **/
    count<T extends CashBookEntryCountArgs>(args?: Prisma.Subset<T, CashBookEntryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CashBookEntryCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a CashBookEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashBookEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CashBookEntryAggregateArgs>(args: Prisma.Subset<T, CashBookEntryAggregateArgs>): Prisma.PrismaPromise<GetCashBookEntryAggregateType<T>>;
    /**
     * Group by CashBookEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CashBookEntryGroupByArgs} args - Group by arguments.
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
    groupBy<T extends CashBookEntryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CashBookEntryGroupByArgs['orderBy'];
    } : {
        orderBy?: CashBookEntryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CashBookEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCashBookEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the CashBookEntry model
     */
    readonly fields: CashBookEntryFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for CashBookEntry.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__CashBookEntryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    branch<T extends Prisma.BranchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BranchDefaultArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the CashBookEntry model
 */
export interface CashBookEntryFieldRefs {
    readonly id_jurnal: Prisma.FieldRef<"CashBookEntry", 'String'>;
    readonly id_cabang: Prisma.FieldRef<"CashBookEntry", 'String'>;
    readonly id_transaksi: Prisma.FieldRef<"CashBookEntry", 'String'>;
    readonly nominal: Prisma.FieldRef<"CashBookEntry", 'Float'>;
    readonly tipe: Prisma.FieldRef<"CashBookEntry", 'String'>;
    readonly deskripsi: Prisma.FieldRef<"CashBookEntry", 'String'>;
    readonly tanggal_jurnal: Prisma.FieldRef<"CashBookEntry", 'DateTime'>;
    readonly created_at: Prisma.FieldRef<"CashBookEntry", 'DateTime'>;
}
/**
 * CashBookEntry findUnique
 */
export type CashBookEntryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which CashBookEntry to fetch.
     */
    where: Prisma.CashBookEntryWhereUniqueInput;
};
/**
 * CashBookEntry findUniqueOrThrow
 */
export type CashBookEntryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which CashBookEntry to fetch.
     */
    where: Prisma.CashBookEntryWhereUniqueInput;
};
/**
 * CashBookEntry findFirst
 */
export type CashBookEntryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which CashBookEntry to fetch.
     */
    where?: Prisma.CashBookEntryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CashBookEntries to fetch.
     */
    orderBy?: Prisma.CashBookEntryOrderByWithRelationInput | Prisma.CashBookEntryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for CashBookEntries.
     */
    cursor?: Prisma.CashBookEntryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CashBookEntries from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CashBookEntries.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of CashBookEntries.
     */
    distinct?: Prisma.CashBookEntryScalarFieldEnum | Prisma.CashBookEntryScalarFieldEnum[];
};
/**
 * CashBookEntry findFirstOrThrow
 */
export type CashBookEntryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which CashBookEntry to fetch.
     */
    where?: Prisma.CashBookEntryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CashBookEntries to fetch.
     */
    orderBy?: Prisma.CashBookEntryOrderByWithRelationInput | Prisma.CashBookEntryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for CashBookEntries.
     */
    cursor?: Prisma.CashBookEntryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CashBookEntries from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CashBookEntries.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of CashBookEntries.
     */
    distinct?: Prisma.CashBookEntryScalarFieldEnum | Prisma.CashBookEntryScalarFieldEnum[];
};
/**
 * CashBookEntry findMany
 */
export type CashBookEntryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which CashBookEntries to fetch.
     */
    where?: Prisma.CashBookEntryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CashBookEntries to fetch.
     */
    orderBy?: Prisma.CashBookEntryOrderByWithRelationInput | Prisma.CashBookEntryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing CashBookEntries.
     */
    cursor?: Prisma.CashBookEntryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CashBookEntries from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CashBookEntries.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of CashBookEntries.
     */
    distinct?: Prisma.CashBookEntryScalarFieldEnum | Prisma.CashBookEntryScalarFieldEnum[];
};
/**
 * CashBookEntry create
 */
export type CashBookEntryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a CashBookEntry.
     */
    data: Prisma.XOR<Prisma.CashBookEntryCreateInput, Prisma.CashBookEntryUncheckedCreateInput>;
};
/**
 * CashBookEntry createMany
 */
export type CashBookEntryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many CashBookEntries.
     */
    data: Prisma.CashBookEntryCreateManyInput | Prisma.CashBookEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * CashBookEntry createManyAndReturn
 */
export type CashBookEntryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashBookEntry
     */
    select?: Prisma.CashBookEntrySelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the CashBookEntry
     */
    omit?: Prisma.CashBookEntryOmit<ExtArgs> | null;
    /**
     * The data used to create many CashBookEntries.
     */
    data: Prisma.CashBookEntryCreateManyInput | Prisma.CashBookEntryCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.CashBookEntryIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * CashBookEntry update
 */
export type CashBookEntryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a CashBookEntry.
     */
    data: Prisma.XOR<Prisma.CashBookEntryUpdateInput, Prisma.CashBookEntryUncheckedUpdateInput>;
    /**
     * Choose, which CashBookEntry to update.
     */
    where: Prisma.CashBookEntryWhereUniqueInput;
};
/**
 * CashBookEntry updateMany
 */
export type CashBookEntryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update CashBookEntries.
     */
    data: Prisma.XOR<Prisma.CashBookEntryUpdateManyMutationInput, Prisma.CashBookEntryUncheckedUpdateManyInput>;
    /**
     * Filter which CashBookEntries to update
     */
    where?: Prisma.CashBookEntryWhereInput;
    /**
     * Limit how many CashBookEntries to update.
     */
    limit?: number;
};
/**
 * CashBookEntry updateManyAndReturn
 */
export type CashBookEntryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CashBookEntry
     */
    select?: Prisma.CashBookEntrySelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the CashBookEntry
     */
    omit?: Prisma.CashBookEntryOmit<ExtArgs> | null;
    /**
     * The data used to update CashBookEntries.
     */
    data: Prisma.XOR<Prisma.CashBookEntryUpdateManyMutationInput, Prisma.CashBookEntryUncheckedUpdateManyInput>;
    /**
     * Filter which CashBookEntries to update
     */
    where?: Prisma.CashBookEntryWhereInput;
    /**
     * Limit how many CashBookEntries to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.CashBookEntryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * CashBookEntry upsert
 */
export type CashBookEntryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the CashBookEntry to update in case it exists.
     */
    where: Prisma.CashBookEntryWhereUniqueInput;
    /**
     * In case the CashBookEntry found by the `where` argument doesn't exist, create a new CashBookEntry with this data.
     */
    create: Prisma.XOR<Prisma.CashBookEntryCreateInput, Prisma.CashBookEntryUncheckedCreateInput>;
    /**
     * In case the CashBookEntry was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.CashBookEntryUpdateInput, Prisma.CashBookEntryUncheckedUpdateInput>;
};
/**
 * CashBookEntry delete
 */
export type CashBookEntryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which CashBookEntry to delete.
     */
    where: Prisma.CashBookEntryWhereUniqueInput;
};
/**
 * CashBookEntry deleteMany
 */
export type CashBookEntryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which CashBookEntries to delete
     */
    where?: Prisma.CashBookEntryWhereInput;
    /**
     * Limit how many CashBookEntries to delete.
     */
    limit?: number;
};
/**
 * CashBookEntry without action
 */
export type CashBookEntryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
//# sourceMappingURL=CashBookEntry.d.ts.map