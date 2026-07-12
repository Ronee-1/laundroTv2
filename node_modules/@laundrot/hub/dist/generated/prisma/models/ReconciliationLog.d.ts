import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model ReconciliationLog
 *
 */
export type ReconciliationLogModel = runtime.Types.Result.DefaultSelection<Prisma.$ReconciliationLogPayload>;
export type AggregateReconciliationLog = {
    _count: ReconciliationLogCountAggregateOutputType | null;
    _avg: ReconciliationLogAvgAggregateOutputType | null;
    _sum: ReconciliationLogSumAggregateOutputType | null;
    _min: ReconciliationLogMinAggregateOutputType | null;
    _max: ReconciliationLogMaxAggregateOutputType | null;
};
export type ReconciliationLogAvgAggregateOutputType = {
    kas_digital: number | null;
    kas_fisik: number | null;
    selisih: number | null;
};
export type ReconciliationLogSumAggregateOutputType = {
    kas_digital: number | null;
    kas_fisik: number | null;
    selisih: number | null;
};
export type ReconciliationLogMinAggregateOutputType = {
    id_rekonsiliasi: string | null;
    id_cabang: string | null;
    tanggal: Date | null;
    kas_digital: number | null;
    kas_fisik: number | null;
    selisih: number | null;
    status: string | null;
    approval_status: string | null;
    catatan: string | null;
    catatan_owner: string | null;
    created_at: Date | null;
};
export type ReconciliationLogMaxAggregateOutputType = {
    id_rekonsiliasi: string | null;
    id_cabang: string | null;
    tanggal: Date | null;
    kas_digital: number | null;
    kas_fisik: number | null;
    selisih: number | null;
    status: string | null;
    approval_status: string | null;
    catatan: string | null;
    catatan_owner: string | null;
    created_at: Date | null;
};
export type ReconciliationLogCountAggregateOutputType = {
    id_rekonsiliasi: number;
    id_cabang: number;
    tanggal: number;
    kas_digital: number;
    kas_fisik: number;
    selisih: number;
    status: number;
    approval_status: number;
    catatan: number;
    catatan_owner: number;
    created_at: number;
    _all: number;
};
export type ReconciliationLogAvgAggregateInputType = {
    kas_digital?: true;
    kas_fisik?: true;
    selisih?: true;
};
export type ReconciliationLogSumAggregateInputType = {
    kas_digital?: true;
    kas_fisik?: true;
    selisih?: true;
};
export type ReconciliationLogMinAggregateInputType = {
    id_rekonsiliasi?: true;
    id_cabang?: true;
    tanggal?: true;
    kas_digital?: true;
    kas_fisik?: true;
    selisih?: true;
    status?: true;
    approval_status?: true;
    catatan?: true;
    catatan_owner?: true;
    created_at?: true;
};
export type ReconciliationLogMaxAggregateInputType = {
    id_rekonsiliasi?: true;
    id_cabang?: true;
    tanggal?: true;
    kas_digital?: true;
    kas_fisik?: true;
    selisih?: true;
    status?: true;
    approval_status?: true;
    catatan?: true;
    catatan_owner?: true;
    created_at?: true;
};
export type ReconciliationLogCountAggregateInputType = {
    id_rekonsiliasi?: true;
    id_cabang?: true;
    tanggal?: true;
    kas_digital?: true;
    kas_fisik?: true;
    selisih?: true;
    status?: true;
    approval_status?: true;
    catatan?: true;
    catatan_owner?: true;
    created_at?: true;
    _all?: true;
};
export type ReconciliationLogAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ReconciliationLog to aggregate.
     */
    where?: Prisma.ReconciliationLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ReconciliationLogs to fetch.
     */
    orderBy?: Prisma.ReconciliationLogOrderByWithRelationInput | Prisma.ReconciliationLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ReconciliationLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ReconciliationLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ReconciliationLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ReconciliationLogs
    **/
    _count?: true | ReconciliationLogCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: ReconciliationLogAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: ReconciliationLogSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ReconciliationLogMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ReconciliationLogMaxAggregateInputType;
};
export type GetReconciliationLogAggregateType<T extends ReconciliationLogAggregateArgs> = {
    [P in keyof T & keyof AggregateReconciliationLog]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateReconciliationLog[P]> : Prisma.GetScalarType<T[P], AggregateReconciliationLog[P]>;
};
export type ReconciliationLogGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ReconciliationLogWhereInput;
    orderBy?: Prisma.ReconciliationLogOrderByWithAggregationInput | Prisma.ReconciliationLogOrderByWithAggregationInput[];
    by: Prisma.ReconciliationLogScalarFieldEnum[] | Prisma.ReconciliationLogScalarFieldEnum;
    having?: Prisma.ReconciliationLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ReconciliationLogCountAggregateInputType | true;
    _avg?: ReconciliationLogAvgAggregateInputType;
    _sum?: ReconciliationLogSumAggregateInputType;
    _min?: ReconciliationLogMinAggregateInputType;
    _max?: ReconciliationLogMaxAggregateInputType;
};
export type ReconciliationLogGroupByOutputType = {
    id_rekonsiliasi: string;
    id_cabang: string;
    tanggal: Date;
    kas_digital: number;
    kas_fisik: number;
    selisih: number;
    status: string;
    approval_status: string;
    catatan: string | null;
    catatan_owner: string | null;
    created_at: Date;
    _count: ReconciliationLogCountAggregateOutputType | null;
    _avg: ReconciliationLogAvgAggregateOutputType | null;
    _sum: ReconciliationLogSumAggregateOutputType | null;
    _min: ReconciliationLogMinAggregateOutputType | null;
    _max: ReconciliationLogMaxAggregateOutputType | null;
};
export type GetReconciliationLogGroupByPayload<T extends ReconciliationLogGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ReconciliationLogGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ReconciliationLogGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ReconciliationLogGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ReconciliationLogGroupByOutputType[P]>;
}>>;
export type ReconciliationLogWhereInput = {
    AND?: Prisma.ReconciliationLogWhereInput | Prisma.ReconciliationLogWhereInput[];
    OR?: Prisma.ReconciliationLogWhereInput[];
    NOT?: Prisma.ReconciliationLogWhereInput | Prisma.ReconciliationLogWhereInput[];
    id_rekonsiliasi?: Prisma.StringFilter<"ReconciliationLog"> | string;
    id_cabang?: Prisma.StringFilter<"ReconciliationLog"> | string;
    tanggal?: Prisma.DateTimeFilter<"ReconciliationLog"> | Date | string;
    kas_digital?: Prisma.FloatFilter<"ReconciliationLog"> | number;
    kas_fisik?: Prisma.FloatFilter<"ReconciliationLog"> | number;
    selisih?: Prisma.FloatFilter<"ReconciliationLog"> | number;
    status?: Prisma.StringFilter<"ReconciliationLog"> | string;
    approval_status?: Prisma.StringFilter<"ReconciliationLog"> | string;
    catatan?: Prisma.StringNullableFilter<"ReconciliationLog"> | string | null;
    catatan_owner?: Prisma.StringNullableFilter<"ReconciliationLog"> | string | null;
    created_at?: Prisma.DateTimeFilter<"ReconciliationLog"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
};
export type ReconciliationLogOrderByWithRelationInput = {
    id_rekonsiliasi?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    tanggal?: Prisma.SortOrder;
    kas_digital?: Prisma.SortOrder;
    kas_fisik?: Prisma.SortOrder;
    selisih?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    approval_status?: Prisma.SortOrder;
    catatan?: Prisma.SortOrderInput | Prisma.SortOrder;
    catatan_owner?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    branch?: Prisma.BranchOrderByWithRelationInput;
};
export type ReconciliationLogWhereUniqueInput = Prisma.AtLeast<{
    id_rekonsiliasi?: string;
    AND?: Prisma.ReconciliationLogWhereInput | Prisma.ReconciliationLogWhereInput[];
    OR?: Prisma.ReconciliationLogWhereInput[];
    NOT?: Prisma.ReconciliationLogWhereInput | Prisma.ReconciliationLogWhereInput[];
    id_cabang?: Prisma.StringFilter<"ReconciliationLog"> | string;
    tanggal?: Prisma.DateTimeFilter<"ReconciliationLog"> | Date | string;
    kas_digital?: Prisma.FloatFilter<"ReconciliationLog"> | number;
    kas_fisik?: Prisma.FloatFilter<"ReconciliationLog"> | number;
    selisih?: Prisma.FloatFilter<"ReconciliationLog"> | number;
    status?: Prisma.StringFilter<"ReconciliationLog"> | string;
    approval_status?: Prisma.StringFilter<"ReconciliationLog"> | string;
    catatan?: Prisma.StringNullableFilter<"ReconciliationLog"> | string | null;
    catatan_owner?: Prisma.StringNullableFilter<"ReconciliationLog"> | string | null;
    created_at?: Prisma.DateTimeFilter<"ReconciliationLog"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
}, "id_rekonsiliasi">;
export type ReconciliationLogOrderByWithAggregationInput = {
    id_rekonsiliasi?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    tanggal?: Prisma.SortOrder;
    kas_digital?: Prisma.SortOrder;
    kas_fisik?: Prisma.SortOrder;
    selisih?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    approval_status?: Prisma.SortOrder;
    catatan?: Prisma.SortOrderInput | Prisma.SortOrder;
    catatan_owner?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.ReconciliationLogCountOrderByAggregateInput;
    _avg?: Prisma.ReconciliationLogAvgOrderByAggregateInput;
    _max?: Prisma.ReconciliationLogMaxOrderByAggregateInput;
    _min?: Prisma.ReconciliationLogMinOrderByAggregateInput;
    _sum?: Prisma.ReconciliationLogSumOrderByAggregateInput;
};
export type ReconciliationLogScalarWhereWithAggregatesInput = {
    AND?: Prisma.ReconciliationLogScalarWhereWithAggregatesInput | Prisma.ReconciliationLogScalarWhereWithAggregatesInput[];
    OR?: Prisma.ReconciliationLogScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ReconciliationLogScalarWhereWithAggregatesInput | Prisma.ReconciliationLogScalarWhereWithAggregatesInput[];
    id_rekonsiliasi?: Prisma.StringWithAggregatesFilter<"ReconciliationLog"> | string;
    id_cabang?: Prisma.StringWithAggregatesFilter<"ReconciliationLog"> | string;
    tanggal?: Prisma.DateTimeWithAggregatesFilter<"ReconciliationLog"> | Date | string;
    kas_digital?: Prisma.FloatWithAggregatesFilter<"ReconciliationLog"> | number;
    kas_fisik?: Prisma.FloatWithAggregatesFilter<"ReconciliationLog"> | number;
    selisih?: Prisma.FloatWithAggregatesFilter<"ReconciliationLog"> | number;
    status?: Prisma.StringWithAggregatesFilter<"ReconciliationLog"> | string;
    approval_status?: Prisma.StringWithAggregatesFilter<"ReconciliationLog"> | string;
    catatan?: Prisma.StringNullableWithAggregatesFilter<"ReconciliationLog"> | string | null;
    catatan_owner?: Prisma.StringNullableWithAggregatesFilter<"ReconciliationLog"> | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"ReconciliationLog"> | Date | string;
};
export type ReconciliationLogCreateInput = {
    id_rekonsiliasi?: string;
    tanggal?: Date | string;
    kas_digital: number;
    kas_fisik: number;
    selisih: number;
    status: string;
    approval_status?: string;
    catatan?: string | null;
    catatan_owner?: string | null;
    created_at?: Date | string;
    branch: Prisma.BranchCreateNestedOneWithoutReconciliationsInput;
};
export type ReconciliationLogUncheckedCreateInput = {
    id_rekonsiliasi?: string;
    id_cabang: string;
    tanggal?: Date | string;
    kas_digital: number;
    kas_fisik: number;
    selisih: number;
    status: string;
    approval_status?: string;
    catatan?: string | null;
    catatan_owner?: string | null;
    created_at?: Date | string;
};
export type ReconciliationLogUpdateInput = {
    id_rekonsiliasi?: Prisma.StringFieldUpdateOperationsInput | string;
    tanggal?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    kas_digital?: Prisma.FloatFieldUpdateOperationsInput | number;
    kas_fisik?: Prisma.FloatFieldUpdateOperationsInput | number;
    selisih?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    approval_status?: Prisma.StringFieldUpdateOperationsInput | string;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    catatan_owner?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneRequiredWithoutReconciliationsNestedInput;
};
export type ReconciliationLogUncheckedUpdateInput = {
    id_rekonsiliasi?: Prisma.StringFieldUpdateOperationsInput | string;
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    tanggal?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    kas_digital?: Prisma.FloatFieldUpdateOperationsInput | number;
    kas_fisik?: Prisma.FloatFieldUpdateOperationsInput | number;
    selisih?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    approval_status?: Prisma.StringFieldUpdateOperationsInput | string;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    catatan_owner?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReconciliationLogCreateManyInput = {
    id_rekonsiliasi?: string;
    id_cabang: string;
    tanggal?: Date | string;
    kas_digital: number;
    kas_fisik: number;
    selisih: number;
    status: string;
    approval_status?: string;
    catatan?: string | null;
    catatan_owner?: string | null;
    created_at?: Date | string;
};
export type ReconciliationLogUpdateManyMutationInput = {
    id_rekonsiliasi?: Prisma.StringFieldUpdateOperationsInput | string;
    tanggal?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    kas_digital?: Prisma.FloatFieldUpdateOperationsInput | number;
    kas_fisik?: Prisma.FloatFieldUpdateOperationsInput | number;
    selisih?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    approval_status?: Prisma.StringFieldUpdateOperationsInput | string;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    catatan_owner?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReconciliationLogUncheckedUpdateManyInput = {
    id_rekonsiliasi?: Prisma.StringFieldUpdateOperationsInput | string;
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    tanggal?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    kas_digital?: Prisma.FloatFieldUpdateOperationsInput | number;
    kas_fisik?: Prisma.FloatFieldUpdateOperationsInput | number;
    selisih?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    approval_status?: Prisma.StringFieldUpdateOperationsInput | string;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    catatan_owner?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReconciliationLogListRelationFilter = {
    every?: Prisma.ReconciliationLogWhereInput;
    some?: Prisma.ReconciliationLogWhereInput;
    none?: Prisma.ReconciliationLogWhereInput;
};
export type ReconciliationLogOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ReconciliationLogCountOrderByAggregateInput = {
    id_rekonsiliasi?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    tanggal?: Prisma.SortOrder;
    kas_digital?: Prisma.SortOrder;
    kas_fisik?: Prisma.SortOrder;
    selisih?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    approval_status?: Prisma.SortOrder;
    catatan?: Prisma.SortOrder;
    catatan_owner?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type ReconciliationLogAvgOrderByAggregateInput = {
    kas_digital?: Prisma.SortOrder;
    kas_fisik?: Prisma.SortOrder;
    selisih?: Prisma.SortOrder;
};
export type ReconciliationLogMaxOrderByAggregateInput = {
    id_rekonsiliasi?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    tanggal?: Prisma.SortOrder;
    kas_digital?: Prisma.SortOrder;
    kas_fisik?: Prisma.SortOrder;
    selisih?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    approval_status?: Prisma.SortOrder;
    catatan?: Prisma.SortOrder;
    catatan_owner?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type ReconciliationLogMinOrderByAggregateInput = {
    id_rekonsiliasi?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    tanggal?: Prisma.SortOrder;
    kas_digital?: Prisma.SortOrder;
    kas_fisik?: Prisma.SortOrder;
    selisih?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    approval_status?: Prisma.SortOrder;
    catatan?: Prisma.SortOrder;
    catatan_owner?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type ReconciliationLogSumOrderByAggregateInput = {
    kas_digital?: Prisma.SortOrder;
    kas_fisik?: Prisma.SortOrder;
    selisih?: Prisma.SortOrder;
};
export type ReconciliationLogCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.ReconciliationLogCreateWithoutBranchInput, Prisma.ReconciliationLogUncheckedCreateWithoutBranchInput> | Prisma.ReconciliationLogCreateWithoutBranchInput[] | Prisma.ReconciliationLogUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.ReconciliationLogCreateOrConnectWithoutBranchInput | Prisma.ReconciliationLogCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.ReconciliationLogCreateManyBranchInputEnvelope;
    connect?: Prisma.ReconciliationLogWhereUniqueInput | Prisma.ReconciliationLogWhereUniqueInput[];
};
export type ReconciliationLogUncheckedCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.ReconciliationLogCreateWithoutBranchInput, Prisma.ReconciliationLogUncheckedCreateWithoutBranchInput> | Prisma.ReconciliationLogCreateWithoutBranchInput[] | Prisma.ReconciliationLogUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.ReconciliationLogCreateOrConnectWithoutBranchInput | Prisma.ReconciliationLogCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.ReconciliationLogCreateManyBranchInputEnvelope;
    connect?: Prisma.ReconciliationLogWhereUniqueInput | Prisma.ReconciliationLogWhereUniqueInput[];
};
export type ReconciliationLogUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.ReconciliationLogCreateWithoutBranchInput, Prisma.ReconciliationLogUncheckedCreateWithoutBranchInput> | Prisma.ReconciliationLogCreateWithoutBranchInput[] | Prisma.ReconciliationLogUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.ReconciliationLogCreateOrConnectWithoutBranchInput | Prisma.ReconciliationLogCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.ReconciliationLogUpsertWithWhereUniqueWithoutBranchInput | Prisma.ReconciliationLogUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.ReconciliationLogCreateManyBranchInputEnvelope;
    set?: Prisma.ReconciliationLogWhereUniqueInput | Prisma.ReconciliationLogWhereUniqueInput[];
    disconnect?: Prisma.ReconciliationLogWhereUniqueInput | Prisma.ReconciliationLogWhereUniqueInput[];
    delete?: Prisma.ReconciliationLogWhereUniqueInput | Prisma.ReconciliationLogWhereUniqueInput[];
    connect?: Prisma.ReconciliationLogWhereUniqueInput | Prisma.ReconciliationLogWhereUniqueInput[];
    update?: Prisma.ReconciliationLogUpdateWithWhereUniqueWithoutBranchInput | Prisma.ReconciliationLogUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.ReconciliationLogUpdateManyWithWhereWithoutBranchInput | Prisma.ReconciliationLogUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.ReconciliationLogScalarWhereInput | Prisma.ReconciliationLogScalarWhereInput[];
};
export type ReconciliationLogUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.ReconciliationLogCreateWithoutBranchInput, Prisma.ReconciliationLogUncheckedCreateWithoutBranchInput> | Prisma.ReconciliationLogCreateWithoutBranchInput[] | Prisma.ReconciliationLogUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.ReconciliationLogCreateOrConnectWithoutBranchInput | Prisma.ReconciliationLogCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.ReconciliationLogUpsertWithWhereUniqueWithoutBranchInput | Prisma.ReconciliationLogUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.ReconciliationLogCreateManyBranchInputEnvelope;
    set?: Prisma.ReconciliationLogWhereUniqueInput | Prisma.ReconciliationLogWhereUniqueInput[];
    disconnect?: Prisma.ReconciliationLogWhereUniqueInput | Prisma.ReconciliationLogWhereUniqueInput[];
    delete?: Prisma.ReconciliationLogWhereUniqueInput | Prisma.ReconciliationLogWhereUniqueInput[];
    connect?: Prisma.ReconciliationLogWhereUniqueInput | Prisma.ReconciliationLogWhereUniqueInput[];
    update?: Prisma.ReconciliationLogUpdateWithWhereUniqueWithoutBranchInput | Prisma.ReconciliationLogUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.ReconciliationLogUpdateManyWithWhereWithoutBranchInput | Prisma.ReconciliationLogUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.ReconciliationLogScalarWhereInput | Prisma.ReconciliationLogScalarWhereInput[];
};
export type ReconciliationLogCreateWithoutBranchInput = {
    id_rekonsiliasi?: string;
    tanggal?: Date | string;
    kas_digital: number;
    kas_fisik: number;
    selisih: number;
    status: string;
    approval_status?: string;
    catatan?: string | null;
    catatan_owner?: string | null;
    created_at?: Date | string;
};
export type ReconciliationLogUncheckedCreateWithoutBranchInput = {
    id_rekonsiliasi?: string;
    tanggal?: Date | string;
    kas_digital: number;
    kas_fisik: number;
    selisih: number;
    status: string;
    approval_status?: string;
    catatan?: string | null;
    catatan_owner?: string | null;
    created_at?: Date | string;
};
export type ReconciliationLogCreateOrConnectWithoutBranchInput = {
    where: Prisma.ReconciliationLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.ReconciliationLogCreateWithoutBranchInput, Prisma.ReconciliationLogUncheckedCreateWithoutBranchInput>;
};
export type ReconciliationLogCreateManyBranchInputEnvelope = {
    data: Prisma.ReconciliationLogCreateManyBranchInput | Prisma.ReconciliationLogCreateManyBranchInput[];
    skipDuplicates?: boolean;
};
export type ReconciliationLogUpsertWithWhereUniqueWithoutBranchInput = {
    where: Prisma.ReconciliationLogWhereUniqueInput;
    update: Prisma.XOR<Prisma.ReconciliationLogUpdateWithoutBranchInput, Prisma.ReconciliationLogUncheckedUpdateWithoutBranchInput>;
    create: Prisma.XOR<Prisma.ReconciliationLogCreateWithoutBranchInput, Prisma.ReconciliationLogUncheckedCreateWithoutBranchInput>;
};
export type ReconciliationLogUpdateWithWhereUniqueWithoutBranchInput = {
    where: Prisma.ReconciliationLogWhereUniqueInput;
    data: Prisma.XOR<Prisma.ReconciliationLogUpdateWithoutBranchInput, Prisma.ReconciliationLogUncheckedUpdateWithoutBranchInput>;
};
export type ReconciliationLogUpdateManyWithWhereWithoutBranchInput = {
    where: Prisma.ReconciliationLogScalarWhereInput;
    data: Prisma.XOR<Prisma.ReconciliationLogUpdateManyMutationInput, Prisma.ReconciliationLogUncheckedUpdateManyWithoutBranchInput>;
};
export type ReconciliationLogScalarWhereInput = {
    AND?: Prisma.ReconciliationLogScalarWhereInput | Prisma.ReconciliationLogScalarWhereInput[];
    OR?: Prisma.ReconciliationLogScalarWhereInput[];
    NOT?: Prisma.ReconciliationLogScalarWhereInput | Prisma.ReconciliationLogScalarWhereInput[];
    id_rekonsiliasi?: Prisma.StringFilter<"ReconciliationLog"> | string;
    id_cabang?: Prisma.StringFilter<"ReconciliationLog"> | string;
    tanggal?: Prisma.DateTimeFilter<"ReconciliationLog"> | Date | string;
    kas_digital?: Prisma.FloatFilter<"ReconciliationLog"> | number;
    kas_fisik?: Prisma.FloatFilter<"ReconciliationLog"> | number;
    selisih?: Prisma.FloatFilter<"ReconciliationLog"> | number;
    status?: Prisma.StringFilter<"ReconciliationLog"> | string;
    approval_status?: Prisma.StringFilter<"ReconciliationLog"> | string;
    catatan?: Prisma.StringNullableFilter<"ReconciliationLog"> | string | null;
    catatan_owner?: Prisma.StringNullableFilter<"ReconciliationLog"> | string | null;
    created_at?: Prisma.DateTimeFilter<"ReconciliationLog"> | Date | string;
};
export type ReconciliationLogCreateManyBranchInput = {
    id_rekonsiliasi?: string;
    tanggal?: Date | string;
    kas_digital: number;
    kas_fisik: number;
    selisih: number;
    status: string;
    approval_status?: string;
    catatan?: string | null;
    catatan_owner?: string | null;
    created_at?: Date | string;
};
export type ReconciliationLogUpdateWithoutBranchInput = {
    id_rekonsiliasi?: Prisma.StringFieldUpdateOperationsInput | string;
    tanggal?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    kas_digital?: Prisma.FloatFieldUpdateOperationsInput | number;
    kas_fisik?: Prisma.FloatFieldUpdateOperationsInput | number;
    selisih?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    approval_status?: Prisma.StringFieldUpdateOperationsInput | string;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    catatan_owner?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReconciliationLogUncheckedUpdateWithoutBranchInput = {
    id_rekonsiliasi?: Prisma.StringFieldUpdateOperationsInput | string;
    tanggal?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    kas_digital?: Prisma.FloatFieldUpdateOperationsInput | number;
    kas_fisik?: Prisma.FloatFieldUpdateOperationsInput | number;
    selisih?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    approval_status?: Prisma.StringFieldUpdateOperationsInput | string;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    catatan_owner?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReconciliationLogUncheckedUpdateManyWithoutBranchInput = {
    id_rekonsiliasi?: Prisma.StringFieldUpdateOperationsInput | string;
    tanggal?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    kas_digital?: Prisma.FloatFieldUpdateOperationsInput | number;
    kas_fisik?: Prisma.FloatFieldUpdateOperationsInput | number;
    selisih?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    approval_status?: Prisma.StringFieldUpdateOperationsInput | string;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    catatan_owner?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ReconciliationLogSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id_rekonsiliasi?: boolean;
    id_cabang?: boolean;
    tanggal?: boolean;
    kas_digital?: boolean;
    kas_fisik?: boolean;
    selisih?: boolean;
    status?: boolean;
    approval_status?: boolean;
    catatan?: boolean;
    catatan_owner?: boolean;
    created_at?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reconciliationLog"]>;
export type ReconciliationLogSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id_rekonsiliasi?: boolean;
    id_cabang?: boolean;
    tanggal?: boolean;
    kas_digital?: boolean;
    kas_fisik?: boolean;
    selisih?: boolean;
    status?: boolean;
    approval_status?: boolean;
    catatan?: boolean;
    catatan_owner?: boolean;
    created_at?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reconciliationLog"]>;
export type ReconciliationLogSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id_rekonsiliasi?: boolean;
    id_cabang?: boolean;
    tanggal?: boolean;
    kas_digital?: boolean;
    kas_fisik?: boolean;
    selisih?: boolean;
    status?: boolean;
    approval_status?: boolean;
    catatan?: boolean;
    catatan_owner?: boolean;
    created_at?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["reconciliationLog"]>;
export type ReconciliationLogSelectScalar = {
    id_rekonsiliasi?: boolean;
    id_cabang?: boolean;
    tanggal?: boolean;
    kas_digital?: boolean;
    kas_fisik?: boolean;
    selisih?: boolean;
    status?: boolean;
    approval_status?: boolean;
    catatan?: boolean;
    catatan_owner?: boolean;
    created_at?: boolean;
};
export type ReconciliationLogOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id_rekonsiliasi" | "id_cabang" | "tanggal" | "kas_digital" | "kas_fisik" | "selisih" | "status" | "approval_status" | "catatan" | "catatan_owner" | "created_at", ExtArgs["result"]["reconciliationLog"]>;
export type ReconciliationLogInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type ReconciliationLogIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type ReconciliationLogIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type $ReconciliationLogPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ReconciliationLog";
    objects: {
        branch: Prisma.$BranchPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id_rekonsiliasi: string;
        id_cabang: string;
        tanggal: Date;
        kas_digital: number;
        kas_fisik: number;
        selisih: number;
        status: string;
        approval_status: string;
        catatan: string | null;
        catatan_owner: string | null;
        created_at: Date;
    }, ExtArgs["result"]["reconciliationLog"]>;
    composites: {};
};
export type ReconciliationLogGetPayload<S extends boolean | null | undefined | ReconciliationLogDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ReconciliationLogPayload, S>;
export type ReconciliationLogCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ReconciliationLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ReconciliationLogCountAggregateInputType | true;
};
export interface ReconciliationLogDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ReconciliationLog'];
        meta: {
            name: 'ReconciliationLog';
        };
    };
    /**
     * Find zero or one ReconciliationLog that matches the filter.
     * @param {ReconciliationLogFindUniqueArgs} args - Arguments to find a ReconciliationLog
     * @example
     * // Get one ReconciliationLog
     * const reconciliationLog = await prisma.reconciliationLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReconciliationLogFindUniqueArgs>(args: Prisma.SelectSubset<T, ReconciliationLogFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ReconciliationLogClient<runtime.Types.Result.GetResult<Prisma.$ReconciliationLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ReconciliationLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReconciliationLogFindUniqueOrThrowArgs} args - Arguments to find a ReconciliationLog
     * @example
     * // Get one ReconciliationLog
     * const reconciliationLog = await prisma.reconciliationLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReconciliationLogFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ReconciliationLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReconciliationLogClient<runtime.Types.Result.GetResult<Prisma.$ReconciliationLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ReconciliationLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationLogFindFirstArgs} args - Arguments to find a ReconciliationLog
     * @example
     * // Get one ReconciliationLog
     * const reconciliationLog = await prisma.reconciliationLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReconciliationLogFindFirstArgs>(args?: Prisma.SelectSubset<T, ReconciliationLogFindFirstArgs<ExtArgs>>): Prisma.Prisma__ReconciliationLogClient<runtime.Types.Result.GetResult<Prisma.$ReconciliationLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ReconciliationLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationLogFindFirstOrThrowArgs} args - Arguments to find a ReconciliationLog
     * @example
     * // Get one ReconciliationLog
     * const reconciliationLog = await prisma.reconciliationLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReconciliationLogFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ReconciliationLogFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ReconciliationLogClient<runtime.Types.Result.GetResult<Prisma.$ReconciliationLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ReconciliationLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReconciliationLogs
     * const reconciliationLogs = await prisma.reconciliationLog.findMany()
     *
     * // Get first 10 ReconciliationLogs
     * const reconciliationLogs = await prisma.reconciliationLog.findMany({ take: 10 })
     *
     * // Only select the `id_rekonsiliasi`
     * const reconciliationLogWithId_rekonsiliasiOnly = await prisma.reconciliationLog.findMany({ select: { id_rekonsiliasi: true } })
     *
     */
    findMany<T extends ReconciliationLogFindManyArgs>(args?: Prisma.SelectSubset<T, ReconciliationLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReconciliationLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ReconciliationLog.
     * @param {ReconciliationLogCreateArgs} args - Arguments to create a ReconciliationLog.
     * @example
     * // Create one ReconciliationLog
     * const ReconciliationLog = await prisma.reconciliationLog.create({
     *   data: {
     *     // ... data to create a ReconciliationLog
     *   }
     * })
     *
     */
    create<T extends ReconciliationLogCreateArgs>(args: Prisma.SelectSubset<T, ReconciliationLogCreateArgs<ExtArgs>>): Prisma.Prisma__ReconciliationLogClient<runtime.Types.Result.GetResult<Prisma.$ReconciliationLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ReconciliationLogs.
     * @param {ReconciliationLogCreateManyArgs} args - Arguments to create many ReconciliationLogs.
     * @example
     * // Create many ReconciliationLogs
     * const reconciliationLog = await prisma.reconciliationLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ReconciliationLogCreateManyArgs>(args?: Prisma.SelectSubset<T, ReconciliationLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many ReconciliationLogs and returns the data saved in the database.
     * @param {ReconciliationLogCreateManyAndReturnArgs} args - Arguments to create many ReconciliationLogs.
     * @example
     * // Create many ReconciliationLogs
     * const reconciliationLog = await prisma.reconciliationLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ReconciliationLogs and only return the `id_rekonsiliasi`
     * const reconciliationLogWithId_rekonsiliasiOnly = await prisma.reconciliationLog.createManyAndReturn({
     *   select: { id_rekonsiliasi: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ReconciliationLogCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ReconciliationLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReconciliationLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a ReconciliationLog.
     * @param {ReconciliationLogDeleteArgs} args - Arguments to delete one ReconciliationLog.
     * @example
     * // Delete one ReconciliationLog
     * const ReconciliationLog = await prisma.reconciliationLog.delete({
     *   where: {
     *     // ... filter to delete one ReconciliationLog
     *   }
     * })
     *
     */
    delete<T extends ReconciliationLogDeleteArgs>(args: Prisma.SelectSubset<T, ReconciliationLogDeleteArgs<ExtArgs>>): Prisma.Prisma__ReconciliationLogClient<runtime.Types.Result.GetResult<Prisma.$ReconciliationLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ReconciliationLog.
     * @param {ReconciliationLogUpdateArgs} args - Arguments to update one ReconciliationLog.
     * @example
     * // Update one ReconciliationLog
     * const reconciliationLog = await prisma.reconciliationLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ReconciliationLogUpdateArgs>(args: Prisma.SelectSubset<T, ReconciliationLogUpdateArgs<ExtArgs>>): Prisma.Prisma__ReconciliationLogClient<runtime.Types.Result.GetResult<Prisma.$ReconciliationLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ReconciliationLogs.
     * @param {ReconciliationLogDeleteManyArgs} args - Arguments to filter ReconciliationLogs to delete.
     * @example
     * // Delete a few ReconciliationLogs
     * const { count } = await prisma.reconciliationLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ReconciliationLogDeleteManyArgs>(args?: Prisma.SelectSubset<T, ReconciliationLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ReconciliationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReconciliationLogs
     * const reconciliationLog = await prisma.reconciliationLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ReconciliationLogUpdateManyArgs>(args: Prisma.SelectSubset<T, ReconciliationLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ReconciliationLogs and returns the data updated in the database.
     * @param {ReconciliationLogUpdateManyAndReturnArgs} args - Arguments to update many ReconciliationLogs.
     * @example
     * // Update many ReconciliationLogs
     * const reconciliationLog = await prisma.reconciliationLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ReconciliationLogs and only return the `id_rekonsiliasi`
     * const reconciliationLogWithId_rekonsiliasiOnly = await prisma.reconciliationLog.updateManyAndReturn({
     *   select: { id_rekonsiliasi: true },
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
    updateManyAndReturn<T extends ReconciliationLogUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ReconciliationLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ReconciliationLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one ReconciliationLog.
     * @param {ReconciliationLogUpsertArgs} args - Arguments to update or create a ReconciliationLog.
     * @example
     * // Update or create a ReconciliationLog
     * const reconciliationLog = await prisma.reconciliationLog.upsert({
     *   create: {
     *     // ... data to create a ReconciliationLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReconciliationLog we want to update
     *   }
     * })
     */
    upsert<T extends ReconciliationLogUpsertArgs>(args: Prisma.SelectSubset<T, ReconciliationLogUpsertArgs<ExtArgs>>): Prisma.Prisma__ReconciliationLogClient<runtime.Types.Result.GetResult<Prisma.$ReconciliationLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ReconciliationLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationLogCountArgs} args - Arguments to filter ReconciliationLogs to count.
     * @example
     * // Count the number of ReconciliationLogs
     * const count = await prisma.reconciliationLog.count({
     *   where: {
     *     // ... the filter for the ReconciliationLogs we want to count
     *   }
     * })
    **/
    count<T extends ReconciliationLogCountArgs>(args?: Prisma.Subset<T, ReconciliationLogCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ReconciliationLogCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ReconciliationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ReconciliationLogAggregateArgs>(args: Prisma.Subset<T, ReconciliationLogAggregateArgs>): Prisma.PrismaPromise<GetReconciliationLogAggregateType<T>>;
    /**
     * Group by ReconciliationLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReconciliationLogGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ReconciliationLogGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ReconciliationLogGroupByArgs['orderBy'];
    } : {
        orderBy?: ReconciliationLogGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ReconciliationLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReconciliationLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ReconciliationLog model
     */
    readonly fields: ReconciliationLogFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ReconciliationLog.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ReconciliationLogClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
 * Fields of the ReconciliationLog model
 */
export interface ReconciliationLogFieldRefs {
    readonly id_rekonsiliasi: Prisma.FieldRef<"ReconciliationLog", 'String'>;
    readonly id_cabang: Prisma.FieldRef<"ReconciliationLog", 'String'>;
    readonly tanggal: Prisma.FieldRef<"ReconciliationLog", 'DateTime'>;
    readonly kas_digital: Prisma.FieldRef<"ReconciliationLog", 'Float'>;
    readonly kas_fisik: Prisma.FieldRef<"ReconciliationLog", 'Float'>;
    readonly selisih: Prisma.FieldRef<"ReconciliationLog", 'Float'>;
    readonly status: Prisma.FieldRef<"ReconciliationLog", 'String'>;
    readonly approval_status: Prisma.FieldRef<"ReconciliationLog", 'String'>;
    readonly catatan: Prisma.FieldRef<"ReconciliationLog", 'String'>;
    readonly catatan_owner: Prisma.FieldRef<"ReconciliationLog", 'String'>;
    readonly created_at: Prisma.FieldRef<"ReconciliationLog", 'DateTime'>;
}
/**
 * ReconciliationLog findUnique
 */
export type ReconciliationLogFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which ReconciliationLog to fetch.
     */
    where: Prisma.ReconciliationLogWhereUniqueInput;
};
/**
 * ReconciliationLog findUniqueOrThrow
 */
export type ReconciliationLogFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which ReconciliationLog to fetch.
     */
    where: Prisma.ReconciliationLogWhereUniqueInput;
};
/**
 * ReconciliationLog findFirst
 */
export type ReconciliationLogFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which ReconciliationLog to fetch.
     */
    where?: Prisma.ReconciliationLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ReconciliationLogs to fetch.
     */
    orderBy?: Prisma.ReconciliationLogOrderByWithRelationInput | Prisma.ReconciliationLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ReconciliationLogs.
     */
    cursor?: Prisma.ReconciliationLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ReconciliationLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ReconciliationLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ReconciliationLogs.
     */
    distinct?: Prisma.ReconciliationLogScalarFieldEnum | Prisma.ReconciliationLogScalarFieldEnum[];
};
/**
 * ReconciliationLog findFirstOrThrow
 */
export type ReconciliationLogFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which ReconciliationLog to fetch.
     */
    where?: Prisma.ReconciliationLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ReconciliationLogs to fetch.
     */
    orderBy?: Prisma.ReconciliationLogOrderByWithRelationInput | Prisma.ReconciliationLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ReconciliationLogs.
     */
    cursor?: Prisma.ReconciliationLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ReconciliationLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ReconciliationLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ReconciliationLogs.
     */
    distinct?: Prisma.ReconciliationLogScalarFieldEnum | Prisma.ReconciliationLogScalarFieldEnum[];
};
/**
 * ReconciliationLog findMany
 */
export type ReconciliationLogFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which ReconciliationLogs to fetch.
     */
    where?: Prisma.ReconciliationLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ReconciliationLogs to fetch.
     */
    orderBy?: Prisma.ReconciliationLogOrderByWithRelationInput | Prisma.ReconciliationLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ReconciliationLogs.
     */
    cursor?: Prisma.ReconciliationLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ReconciliationLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ReconciliationLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ReconciliationLogs.
     */
    distinct?: Prisma.ReconciliationLogScalarFieldEnum | Prisma.ReconciliationLogScalarFieldEnum[];
};
/**
 * ReconciliationLog create
 */
export type ReconciliationLogCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a ReconciliationLog.
     */
    data: Prisma.XOR<Prisma.ReconciliationLogCreateInput, Prisma.ReconciliationLogUncheckedCreateInput>;
};
/**
 * ReconciliationLog createMany
 */
export type ReconciliationLogCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReconciliationLogs.
     */
    data: Prisma.ReconciliationLogCreateManyInput | Prisma.ReconciliationLogCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ReconciliationLog createManyAndReturn
 */
export type ReconciliationLogCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationLog
     */
    select?: Prisma.ReconciliationLogSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ReconciliationLog
     */
    omit?: Prisma.ReconciliationLogOmit<ExtArgs> | null;
    /**
     * The data used to create many ReconciliationLogs.
     */
    data: Prisma.ReconciliationLogCreateManyInput | Prisma.ReconciliationLogCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReconciliationLogIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * ReconciliationLog update
 */
export type ReconciliationLogUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a ReconciliationLog.
     */
    data: Prisma.XOR<Prisma.ReconciliationLogUpdateInput, Prisma.ReconciliationLogUncheckedUpdateInput>;
    /**
     * Choose, which ReconciliationLog to update.
     */
    where: Prisma.ReconciliationLogWhereUniqueInput;
};
/**
 * ReconciliationLog updateMany
 */
export type ReconciliationLogUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ReconciliationLogs.
     */
    data: Prisma.XOR<Prisma.ReconciliationLogUpdateManyMutationInput, Prisma.ReconciliationLogUncheckedUpdateManyInput>;
    /**
     * Filter which ReconciliationLogs to update
     */
    where?: Prisma.ReconciliationLogWhereInput;
    /**
     * Limit how many ReconciliationLogs to update.
     */
    limit?: number;
};
/**
 * ReconciliationLog updateManyAndReturn
 */
export type ReconciliationLogUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReconciliationLog
     */
    select?: Prisma.ReconciliationLogSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ReconciliationLog
     */
    omit?: Prisma.ReconciliationLogOmit<ExtArgs> | null;
    /**
     * The data used to update ReconciliationLogs.
     */
    data: Prisma.XOR<Prisma.ReconciliationLogUpdateManyMutationInput, Prisma.ReconciliationLogUncheckedUpdateManyInput>;
    /**
     * Filter which ReconciliationLogs to update
     */
    where?: Prisma.ReconciliationLogWhereInput;
    /**
     * Limit how many ReconciliationLogs to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ReconciliationLogIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * ReconciliationLog upsert
 */
export type ReconciliationLogUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the ReconciliationLog to update in case it exists.
     */
    where: Prisma.ReconciliationLogWhereUniqueInput;
    /**
     * In case the ReconciliationLog found by the `where` argument doesn't exist, create a new ReconciliationLog with this data.
     */
    create: Prisma.XOR<Prisma.ReconciliationLogCreateInput, Prisma.ReconciliationLogUncheckedCreateInput>;
    /**
     * In case the ReconciliationLog was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ReconciliationLogUpdateInput, Prisma.ReconciliationLogUncheckedUpdateInput>;
};
/**
 * ReconciliationLog delete
 */
export type ReconciliationLogDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which ReconciliationLog to delete.
     */
    where: Prisma.ReconciliationLogWhereUniqueInput;
};
/**
 * ReconciliationLog deleteMany
 */
export type ReconciliationLogDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ReconciliationLogs to delete
     */
    where?: Prisma.ReconciliationLogWhereInput;
    /**
     * Limit how many ReconciliationLogs to delete.
     */
    limit?: number;
};
/**
 * ReconciliationLog without action
 */
export type ReconciliationLogDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
//# sourceMappingURL=ReconciliationLog.d.ts.map