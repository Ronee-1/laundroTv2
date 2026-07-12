import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model RestockRequest
 *
 */
export type RestockRequestModel = runtime.Types.Result.DefaultSelection<Prisma.$RestockRequestPayload>;
export type AggregateRestockRequest = {
    _count: RestockRequestCountAggregateOutputType | null;
    _min: RestockRequestMinAggregateOutputType | null;
    _max: RestockRequestMaxAggregateOutputType | null;
};
export type RestockRequestMinAggregateOutputType = {
    id_request: string | null;
    id_cabang: string | null;
    nama_cabang: string | null;
    created_by: string | null;
    status: string | null;
    catatan: string | null;
    reviewed_by: string | null;
    reviewed_at: Date | null;
    created_at: Date | null;
};
export type RestockRequestMaxAggregateOutputType = {
    id_request: string | null;
    id_cabang: string | null;
    nama_cabang: string | null;
    created_by: string | null;
    status: string | null;
    catatan: string | null;
    reviewed_by: string | null;
    reviewed_at: Date | null;
    created_at: Date | null;
};
export type RestockRequestCountAggregateOutputType = {
    id_request: number;
    id_cabang: number;
    nama_cabang: number;
    created_by: number;
    requested_items: number;
    status: number;
    catatan: number;
    reviewed_by: number;
    reviewed_at: number;
    created_at: number;
    _all: number;
};
export type RestockRequestMinAggregateInputType = {
    id_request?: true;
    id_cabang?: true;
    nama_cabang?: true;
    created_by?: true;
    status?: true;
    catatan?: true;
    reviewed_by?: true;
    reviewed_at?: true;
    created_at?: true;
};
export type RestockRequestMaxAggregateInputType = {
    id_request?: true;
    id_cabang?: true;
    nama_cabang?: true;
    created_by?: true;
    status?: true;
    catatan?: true;
    reviewed_by?: true;
    reviewed_at?: true;
    created_at?: true;
};
export type RestockRequestCountAggregateInputType = {
    id_request?: true;
    id_cabang?: true;
    nama_cabang?: true;
    created_by?: true;
    requested_items?: true;
    status?: true;
    catatan?: true;
    reviewed_by?: true;
    reviewed_at?: true;
    created_at?: true;
    _all?: true;
};
export type RestockRequestAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which RestockRequest to aggregate.
     */
    where?: Prisma.RestockRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RestockRequests to fetch.
     */
    orderBy?: Prisma.RestockRequestOrderByWithRelationInput | Prisma.RestockRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.RestockRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RestockRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RestockRequests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned RestockRequests
    **/
    _count?: true | RestockRequestCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: RestockRequestMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: RestockRequestMaxAggregateInputType;
};
export type GetRestockRequestAggregateType<T extends RestockRequestAggregateArgs> = {
    [P in keyof T & keyof AggregateRestockRequest]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRestockRequest[P]> : Prisma.GetScalarType<T[P], AggregateRestockRequest[P]>;
};
export type RestockRequestGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RestockRequestWhereInput;
    orderBy?: Prisma.RestockRequestOrderByWithAggregationInput | Prisma.RestockRequestOrderByWithAggregationInput[];
    by: Prisma.RestockRequestScalarFieldEnum[] | Prisma.RestockRequestScalarFieldEnum;
    having?: Prisma.RestockRequestScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RestockRequestCountAggregateInputType | true;
    _min?: RestockRequestMinAggregateInputType;
    _max?: RestockRequestMaxAggregateInputType;
};
export type RestockRequestGroupByOutputType = {
    id_request: string;
    id_cabang: string;
    nama_cabang: string;
    created_by: string;
    requested_items: runtime.JsonValue;
    status: string;
    catatan: string | null;
    reviewed_by: string | null;
    reviewed_at: Date | null;
    created_at: Date;
    _count: RestockRequestCountAggregateOutputType | null;
    _min: RestockRequestMinAggregateOutputType | null;
    _max: RestockRequestMaxAggregateOutputType | null;
};
export type GetRestockRequestGroupByPayload<T extends RestockRequestGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RestockRequestGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RestockRequestGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RestockRequestGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RestockRequestGroupByOutputType[P]>;
}>>;
export type RestockRequestWhereInput = {
    AND?: Prisma.RestockRequestWhereInput | Prisma.RestockRequestWhereInput[];
    OR?: Prisma.RestockRequestWhereInput[];
    NOT?: Prisma.RestockRequestWhereInput | Prisma.RestockRequestWhereInput[];
    id_request?: Prisma.StringFilter<"RestockRequest"> | string;
    id_cabang?: Prisma.StringFilter<"RestockRequest"> | string;
    nama_cabang?: Prisma.StringFilter<"RestockRequest"> | string;
    created_by?: Prisma.StringFilter<"RestockRequest"> | string;
    requested_items?: Prisma.JsonFilter<"RestockRequest">;
    status?: Prisma.StringFilter<"RestockRequest"> | string;
    catatan?: Prisma.StringNullableFilter<"RestockRequest"> | string | null;
    reviewed_by?: Prisma.StringNullableFilter<"RestockRequest"> | string | null;
    reviewed_at?: Prisma.DateTimeNullableFilter<"RestockRequest"> | Date | string | null;
    created_at?: Prisma.DateTimeFilter<"RestockRequest"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
};
export type RestockRequestOrderByWithRelationInput = {
    id_request?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    nama_cabang?: Prisma.SortOrder;
    created_by?: Prisma.SortOrder;
    requested_items?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    catatan?: Prisma.SortOrderInput | Prisma.SortOrder;
    reviewed_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    reviewed_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    branch?: Prisma.BranchOrderByWithRelationInput;
};
export type RestockRequestWhereUniqueInput = Prisma.AtLeast<{
    id_request?: string;
    AND?: Prisma.RestockRequestWhereInput | Prisma.RestockRequestWhereInput[];
    OR?: Prisma.RestockRequestWhereInput[];
    NOT?: Prisma.RestockRequestWhereInput | Prisma.RestockRequestWhereInput[];
    id_cabang?: Prisma.StringFilter<"RestockRequest"> | string;
    nama_cabang?: Prisma.StringFilter<"RestockRequest"> | string;
    created_by?: Prisma.StringFilter<"RestockRequest"> | string;
    requested_items?: Prisma.JsonFilter<"RestockRequest">;
    status?: Prisma.StringFilter<"RestockRequest"> | string;
    catatan?: Prisma.StringNullableFilter<"RestockRequest"> | string | null;
    reviewed_by?: Prisma.StringNullableFilter<"RestockRequest"> | string | null;
    reviewed_at?: Prisma.DateTimeNullableFilter<"RestockRequest"> | Date | string | null;
    created_at?: Prisma.DateTimeFilter<"RestockRequest"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
}, "id_request">;
export type RestockRequestOrderByWithAggregationInput = {
    id_request?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    nama_cabang?: Prisma.SortOrder;
    created_by?: Prisma.SortOrder;
    requested_items?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    catatan?: Prisma.SortOrderInput | Prisma.SortOrder;
    reviewed_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    reviewed_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.RestockRequestCountOrderByAggregateInput;
    _max?: Prisma.RestockRequestMaxOrderByAggregateInput;
    _min?: Prisma.RestockRequestMinOrderByAggregateInput;
};
export type RestockRequestScalarWhereWithAggregatesInput = {
    AND?: Prisma.RestockRequestScalarWhereWithAggregatesInput | Prisma.RestockRequestScalarWhereWithAggregatesInput[];
    OR?: Prisma.RestockRequestScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RestockRequestScalarWhereWithAggregatesInput | Prisma.RestockRequestScalarWhereWithAggregatesInput[];
    id_request?: Prisma.StringWithAggregatesFilter<"RestockRequest"> | string;
    id_cabang?: Prisma.StringWithAggregatesFilter<"RestockRequest"> | string;
    nama_cabang?: Prisma.StringWithAggregatesFilter<"RestockRequest"> | string;
    created_by?: Prisma.StringWithAggregatesFilter<"RestockRequest"> | string;
    requested_items?: Prisma.JsonWithAggregatesFilter<"RestockRequest">;
    status?: Prisma.StringWithAggregatesFilter<"RestockRequest"> | string;
    catatan?: Prisma.StringNullableWithAggregatesFilter<"RestockRequest"> | string | null;
    reviewed_by?: Prisma.StringNullableWithAggregatesFilter<"RestockRequest"> | string | null;
    reviewed_at?: Prisma.DateTimeNullableWithAggregatesFilter<"RestockRequest"> | Date | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"RestockRequest"> | Date | string;
};
export type RestockRequestCreateInput = {
    id_request?: string;
    nama_cabang: string;
    created_by: string;
    requested_items: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    catatan?: string | null;
    reviewed_by?: string | null;
    reviewed_at?: Date | string | null;
    created_at?: Date | string;
    branch: Prisma.BranchCreateNestedOneWithoutRestock_requestsInput;
};
export type RestockRequestUncheckedCreateInput = {
    id_request?: string;
    id_cabang: string;
    nama_cabang: string;
    created_by: string;
    requested_items: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    catatan?: string | null;
    reviewed_by?: string | null;
    reviewed_at?: Date | string | null;
    created_at?: Date | string;
};
export type RestockRequestUpdateInput = {
    id_request?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.StringFieldUpdateOperationsInput | string;
    requested_items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneRequiredWithoutRestock_requestsNestedInput;
};
export type RestockRequestUncheckedUpdateInput = {
    id_request?: Prisma.StringFieldUpdateOperationsInput | string;
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.StringFieldUpdateOperationsInput | string;
    requested_items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RestockRequestCreateManyInput = {
    id_request?: string;
    id_cabang: string;
    nama_cabang: string;
    created_by: string;
    requested_items: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    catatan?: string | null;
    reviewed_by?: string | null;
    reviewed_at?: Date | string | null;
    created_at?: Date | string;
};
export type RestockRequestUpdateManyMutationInput = {
    id_request?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.StringFieldUpdateOperationsInput | string;
    requested_items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RestockRequestUncheckedUpdateManyInput = {
    id_request?: Prisma.StringFieldUpdateOperationsInput | string;
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.StringFieldUpdateOperationsInput | string;
    requested_items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RestockRequestListRelationFilter = {
    every?: Prisma.RestockRequestWhereInput;
    some?: Prisma.RestockRequestWhereInput;
    none?: Prisma.RestockRequestWhereInput;
};
export type RestockRequestOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RestockRequestCountOrderByAggregateInput = {
    id_request?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    nama_cabang?: Prisma.SortOrder;
    created_by?: Prisma.SortOrder;
    requested_items?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    catatan?: Prisma.SortOrder;
    reviewed_by?: Prisma.SortOrder;
    reviewed_at?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type RestockRequestMaxOrderByAggregateInput = {
    id_request?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    nama_cabang?: Prisma.SortOrder;
    created_by?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    catatan?: Prisma.SortOrder;
    reviewed_by?: Prisma.SortOrder;
    reviewed_at?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type RestockRequestMinOrderByAggregateInput = {
    id_request?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    nama_cabang?: Prisma.SortOrder;
    created_by?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    catatan?: Prisma.SortOrder;
    reviewed_by?: Prisma.SortOrder;
    reviewed_at?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type RestockRequestCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.RestockRequestCreateWithoutBranchInput, Prisma.RestockRequestUncheckedCreateWithoutBranchInput> | Prisma.RestockRequestCreateWithoutBranchInput[] | Prisma.RestockRequestUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.RestockRequestCreateOrConnectWithoutBranchInput | Prisma.RestockRequestCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.RestockRequestCreateManyBranchInputEnvelope;
    connect?: Prisma.RestockRequestWhereUniqueInput | Prisma.RestockRequestWhereUniqueInput[];
};
export type RestockRequestUncheckedCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.RestockRequestCreateWithoutBranchInput, Prisma.RestockRequestUncheckedCreateWithoutBranchInput> | Prisma.RestockRequestCreateWithoutBranchInput[] | Prisma.RestockRequestUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.RestockRequestCreateOrConnectWithoutBranchInput | Prisma.RestockRequestCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.RestockRequestCreateManyBranchInputEnvelope;
    connect?: Prisma.RestockRequestWhereUniqueInput | Prisma.RestockRequestWhereUniqueInput[];
};
export type RestockRequestUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.RestockRequestCreateWithoutBranchInput, Prisma.RestockRequestUncheckedCreateWithoutBranchInput> | Prisma.RestockRequestCreateWithoutBranchInput[] | Prisma.RestockRequestUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.RestockRequestCreateOrConnectWithoutBranchInput | Prisma.RestockRequestCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.RestockRequestUpsertWithWhereUniqueWithoutBranchInput | Prisma.RestockRequestUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.RestockRequestCreateManyBranchInputEnvelope;
    set?: Prisma.RestockRequestWhereUniqueInput | Prisma.RestockRequestWhereUniqueInput[];
    disconnect?: Prisma.RestockRequestWhereUniqueInput | Prisma.RestockRequestWhereUniqueInput[];
    delete?: Prisma.RestockRequestWhereUniqueInput | Prisma.RestockRequestWhereUniqueInput[];
    connect?: Prisma.RestockRequestWhereUniqueInput | Prisma.RestockRequestWhereUniqueInput[];
    update?: Prisma.RestockRequestUpdateWithWhereUniqueWithoutBranchInput | Prisma.RestockRequestUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.RestockRequestUpdateManyWithWhereWithoutBranchInput | Prisma.RestockRequestUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.RestockRequestScalarWhereInput | Prisma.RestockRequestScalarWhereInput[];
};
export type RestockRequestUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.RestockRequestCreateWithoutBranchInput, Prisma.RestockRequestUncheckedCreateWithoutBranchInput> | Prisma.RestockRequestCreateWithoutBranchInput[] | Prisma.RestockRequestUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.RestockRequestCreateOrConnectWithoutBranchInput | Prisma.RestockRequestCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.RestockRequestUpsertWithWhereUniqueWithoutBranchInput | Prisma.RestockRequestUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.RestockRequestCreateManyBranchInputEnvelope;
    set?: Prisma.RestockRequestWhereUniqueInput | Prisma.RestockRequestWhereUniqueInput[];
    disconnect?: Prisma.RestockRequestWhereUniqueInput | Prisma.RestockRequestWhereUniqueInput[];
    delete?: Prisma.RestockRequestWhereUniqueInput | Prisma.RestockRequestWhereUniqueInput[];
    connect?: Prisma.RestockRequestWhereUniqueInput | Prisma.RestockRequestWhereUniqueInput[];
    update?: Prisma.RestockRequestUpdateWithWhereUniqueWithoutBranchInput | Prisma.RestockRequestUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.RestockRequestUpdateManyWithWhereWithoutBranchInput | Prisma.RestockRequestUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.RestockRequestScalarWhereInput | Prisma.RestockRequestScalarWhereInput[];
};
export type RestockRequestCreateWithoutBranchInput = {
    id_request?: string;
    nama_cabang: string;
    created_by: string;
    requested_items: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    catatan?: string | null;
    reviewed_by?: string | null;
    reviewed_at?: Date | string | null;
    created_at?: Date | string;
};
export type RestockRequestUncheckedCreateWithoutBranchInput = {
    id_request?: string;
    nama_cabang: string;
    created_by: string;
    requested_items: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    catatan?: string | null;
    reviewed_by?: string | null;
    reviewed_at?: Date | string | null;
    created_at?: Date | string;
};
export type RestockRequestCreateOrConnectWithoutBranchInput = {
    where: Prisma.RestockRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.RestockRequestCreateWithoutBranchInput, Prisma.RestockRequestUncheckedCreateWithoutBranchInput>;
};
export type RestockRequestCreateManyBranchInputEnvelope = {
    data: Prisma.RestockRequestCreateManyBranchInput | Prisma.RestockRequestCreateManyBranchInput[];
    skipDuplicates?: boolean;
};
export type RestockRequestUpsertWithWhereUniqueWithoutBranchInput = {
    where: Prisma.RestockRequestWhereUniqueInput;
    update: Prisma.XOR<Prisma.RestockRequestUpdateWithoutBranchInput, Prisma.RestockRequestUncheckedUpdateWithoutBranchInput>;
    create: Prisma.XOR<Prisma.RestockRequestCreateWithoutBranchInput, Prisma.RestockRequestUncheckedCreateWithoutBranchInput>;
};
export type RestockRequestUpdateWithWhereUniqueWithoutBranchInput = {
    where: Prisma.RestockRequestWhereUniqueInput;
    data: Prisma.XOR<Prisma.RestockRequestUpdateWithoutBranchInput, Prisma.RestockRequestUncheckedUpdateWithoutBranchInput>;
};
export type RestockRequestUpdateManyWithWhereWithoutBranchInput = {
    where: Prisma.RestockRequestScalarWhereInput;
    data: Prisma.XOR<Prisma.RestockRequestUpdateManyMutationInput, Prisma.RestockRequestUncheckedUpdateManyWithoutBranchInput>;
};
export type RestockRequestScalarWhereInput = {
    AND?: Prisma.RestockRequestScalarWhereInput | Prisma.RestockRequestScalarWhereInput[];
    OR?: Prisma.RestockRequestScalarWhereInput[];
    NOT?: Prisma.RestockRequestScalarWhereInput | Prisma.RestockRequestScalarWhereInput[];
    id_request?: Prisma.StringFilter<"RestockRequest"> | string;
    id_cabang?: Prisma.StringFilter<"RestockRequest"> | string;
    nama_cabang?: Prisma.StringFilter<"RestockRequest"> | string;
    created_by?: Prisma.StringFilter<"RestockRequest"> | string;
    requested_items?: Prisma.JsonFilter<"RestockRequest">;
    status?: Prisma.StringFilter<"RestockRequest"> | string;
    catatan?: Prisma.StringNullableFilter<"RestockRequest"> | string | null;
    reviewed_by?: Prisma.StringNullableFilter<"RestockRequest"> | string | null;
    reviewed_at?: Prisma.DateTimeNullableFilter<"RestockRequest"> | Date | string | null;
    created_at?: Prisma.DateTimeFilter<"RestockRequest"> | Date | string;
};
export type RestockRequestCreateManyBranchInput = {
    id_request?: string;
    nama_cabang: string;
    created_by: string;
    requested_items: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    catatan?: string | null;
    reviewed_by?: string | null;
    reviewed_at?: Date | string | null;
    created_at?: Date | string;
};
export type RestockRequestUpdateWithoutBranchInput = {
    id_request?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.StringFieldUpdateOperationsInput | string;
    requested_items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RestockRequestUncheckedUpdateWithoutBranchInput = {
    id_request?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.StringFieldUpdateOperationsInput | string;
    requested_items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RestockRequestUncheckedUpdateManyWithoutBranchInput = {
    id_request?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.StringFieldUpdateOperationsInput | string;
    requested_items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    catatan?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewed_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reviewed_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RestockRequestSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id_request?: boolean;
    id_cabang?: boolean;
    nama_cabang?: boolean;
    created_by?: boolean;
    requested_items?: boolean;
    status?: boolean;
    catatan?: boolean;
    reviewed_by?: boolean;
    reviewed_at?: boolean;
    created_at?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["restockRequest"]>;
export type RestockRequestSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id_request?: boolean;
    id_cabang?: boolean;
    nama_cabang?: boolean;
    created_by?: boolean;
    requested_items?: boolean;
    status?: boolean;
    catatan?: boolean;
    reviewed_by?: boolean;
    reviewed_at?: boolean;
    created_at?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["restockRequest"]>;
export type RestockRequestSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id_request?: boolean;
    id_cabang?: boolean;
    nama_cabang?: boolean;
    created_by?: boolean;
    requested_items?: boolean;
    status?: boolean;
    catatan?: boolean;
    reviewed_by?: boolean;
    reviewed_at?: boolean;
    created_at?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["restockRequest"]>;
export type RestockRequestSelectScalar = {
    id_request?: boolean;
    id_cabang?: boolean;
    nama_cabang?: boolean;
    created_by?: boolean;
    requested_items?: boolean;
    status?: boolean;
    catatan?: boolean;
    reviewed_by?: boolean;
    reviewed_at?: boolean;
    created_at?: boolean;
};
export type RestockRequestOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id_request" | "id_cabang" | "nama_cabang" | "created_by" | "requested_items" | "status" | "catatan" | "reviewed_by" | "reviewed_at" | "created_at", ExtArgs["result"]["restockRequest"]>;
export type RestockRequestInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type RestockRequestIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type RestockRequestIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type $RestockRequestPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RestockRequest";
    objects: {
        branch: Prisma.$BranchPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id_request: string;
        id_cabang: string;
        nama_cabang: string;
        created_by: string;
        requested_items: runtime.JsonValue;
        status: string;
        catatan: string | null;
        reviewed_by: string | null;
        reviewed_at: Date | null;
        created_at: Date;
    }, ExtArgs["result"]["restockRequest"]>;
    composites: {};
};
export type RestockRequestGetPayload<S extends boolean | null | undefined | RestockRequestDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RestockRequestPayload, S>;
export type RestockRequestCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RestockRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RestockRequestCountAggregateInputType | true;
};
export interface RestockRequestDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RestockRequest'];
        meta: {
            name: 'RestockRequest';
        };
    };
    /**
     * Find zero or one RestockRequest that matches the filter.
     * @param {RestockRequestFindUniqueArgs} args - Arguments to find a RestockRequest
     * @example
     * // Get one RestockRequest
     * const restockRequest = await prisma.restockRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RestockRequestFindUniqueArgs>(args: Prisma.SelectSubset<T, RestockRequestFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RestockRequestClient<runtime.Types.Result.GetResult<Prisma.$RestockRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one RestockRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RestockRequestFindUniqueOrThrowArgs} args - Arguments to find a RestockRequest
     * @example
     * // Get one RestockRequest
     * const restockRequest = await prisma.restockRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RestockRequestFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RestockRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RestockRequestClient<runtime.Types.Result.GetResult<Prisma.$RestockRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first RestockRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestockRequestFindFirstArgs} args - Arguments to find a RestockRequest
     * @example
     * // Get one RestockRequest
     * const restockRequest = await prisma.restockRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RestockRequestFindFirstArgs>(args?: Prisma.SelectSubset<T, RestockRequestFindFirstArgs<ExtArgs>>): Prisma.Prisma__RestockRequestClient<runtime.Types.Result.GetResult<Prisma.$RestockRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first RestockRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestockRequestFindFirstOrThrowArgs} args - Arguments to find a RestockRequest
     * @example
     * // Get one RestockRequest
     * const restockRequest = await prisma.restockRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RestockRequestFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RestockRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RestockRequestClient<runtime.Types.Result.GetResult<Prisma.$RestockRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more RestockRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestockRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RestockRequests
     * const restockRequests = await prisma.restockRequest.findMany()
     *
     * // Get first 10 RestockRequests
     * const restockRequests = await prisma.restockRequest.findMany({ take: 10 })
     *
     * // Only select the `id_request`
     * const restockRequestWithId_requestOnly = await prisma.restockRequest.findMany({ select: { id_request: true } })
     *
     */
    findMany<T extends RestockRequestFindManyArgs>(args?: Prisma.SelectSubset<T, RestockRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RestockRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a RestockRequest.
     * @param {RestockRequestCreateArgs} args - Arguments to create a RestockRequest.
     * @example
     * // Create one RestockRequest
     * const RestockRequest = await prisma.restockRequest.create({
     *   data: {
     *     // ... data to create a RestockRequest
     *   }
     * })
     *
     */
    create<T extends RestockRequestCreateArgs>(args: Prisma.SelectSubset<T, RestockRequestCreateArgs<ExtArgs>>): Prisma.Prisma__RestockRequestClient<runtime.Types.Result.GetResult<Prisma.$RestockRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many RestockRequests.
     * @param {RestockRequestCreateManyArgs} args - Arguments to create many RestockRequests.
     * @example
     * // Create many RestockRequests
     * const restockRequest = await prisma.restockRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends RestockRequestCreateManyArgs>(args?: Prisma.SelectSubset<T, RestockRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many RestockRequests and returns the data saved in the database.
     * @param {RestockRequestCreateManyAndReturnArgs} args - Arguments to create many RestockRequests.
     * @example
     * // Create many RestockRequests
     * const restockRequest = await prisma.restockRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many RestockRequests and only return the `id_request`
     * const restockRequestWithId_requestOnly = await prisma.restockRequest.createManyAndReturn({
     *   select: { id_request: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends RestockRequestCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RestockRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RestockRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a RestockRequest.
     * @param {RestockRequestDeleteArgs} args - Arguments to delete one RestockRequest.
     * @example
     * // Delete one RestockRequest
     * const RestockRequest = await prisma.restockRequest.delete({
     *   where: {
     *     // ... filter to delete one RestockRequest
     *   }
     * })
     *
     */
    delete<T extends RestockRequestDeleteArgs>(args: Prisma.SelectSubset<T, RestockRequestDeleteArgs<ExtArgs>>): Prisma.Prisma__RestockRequestClient<runtime.Types.Result.GetResult<Prisma.$RestockRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one RestockRequest.
     * @param {RestockRequestUpdateArgs} args - Arguments to update one RestockRequest.
     * @example
     * // Update one RestockRequest
     * const restockRequest = await prisma.restockRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends RestockRequestUpdateArgs>(args: Prisma.SelectSubset<T, RestockRequestUpdateArgs<ExtArgs>>): Prisma.Prisma__RestockRequestClient<runtime.Types.Result.GetResult<Prisma.$RestockRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more RestockRequests.
     * @param {RestockRequestDeleteManyArgs} args - Arguments to filter RestockRequests to delete.
     * @example
     * // Delete a few RestockRequests
     * const { count } = await prisma.restockRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends RestockRequestDeleteManyArgs>(args?: Prisma.SelectSubset<T, RestockRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more RestockRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestockRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RestockRequests
     * const restockRequest = await prisma.restockRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends RestockRequestUpdateManyArgs>(args: Prisma.SelectSubset<T, RestockRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more RestockRequests and returns the data updated in the database.
     * @param {RestockRequestUpdateManyAndReturnArgs} args - Arguments to update many RestockRequests.
     * @example
     * // Update many RestockRequests
     * const restockRequest = await prisma.restockRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more RestockRequests and only return the `id_request`
     * const restockRequestWithId_requestOnly = await prisma.restockRequest.updateManyAndReturn({
     *   select: { id_request: true },
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
    updateManyAndReturn<T extends RestockRequestUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RestockRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RestockRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one RestockRequest.
     * @param {RestockRequestUpsertArgs} args - Arguments to update or create a RestockRequest.
     * @example
     * // Update or create a RestockRequest
     * const restockRequest = await prisma.restockRequest.upsert({
     *   create: {
     *     // ... data to create a RestockRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RestockRequest we want to update
     *   }
     * })
     */
    upsert<T extends RestockRequestUpsertArgs>(args: Prisma.SelectSubset<T, RestockRequestUpsertArgs<ExtArgs>>): Prisma.Prisma__RestockRequestClient<runtime.Types.Result.GetResult<Prisma.$RestockRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of RestockRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestockRequestCountArgs} args - Arguments to filter RestockRequests to count.
     * @example
     * // Count the number of RestockRequests
     * const count = await prisma.restockRequest.count({
     *   where: {
     *     // ... the filter for the RestockRequests we want to count
     *   }
     * })
    **/
    count<T extends RestockRequestCountArgs>(args?: Prisma.Subset<T, RestockRequestCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RestockRequestCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a RestockRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestockRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RestockRequestAggregateArgs>(args: Prisma.Subset<T, RestockRequestAggregateArgs>): Prisma.PrismaPromise<GetRestockRequestAggregateType<T>>;
    /**
     * Group by RestockRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestockRequestGroupByArgs} args - Group by arguments.
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
    groupBy<T extends RestockRequestGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RestockRequestGroupByArgs['orderBy'];
    } : {
        orderBy?: RestockRequestGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RestockRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRestockRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the RestockRequest model
     */
    readonly fields: RestockRequestFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for RestockRequest.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__RestockRequestClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
 * Fields of the RestockRequest model
 */
export interface RestockRequestFieldRefs {
    readonly id_request: Prisma.FieldRef<"RestockRequest", 'String'>;
    readonly id_cabang: Prisma.FieldRef<"RestockRequest", 'String'>;
    readonly nama_cabang: Prisma.FieldRef<"RestockRequest", 'String'>;
    readonly created_by: Prisma.FieldRef<"RestockRequest", 'String'>;
    readonly requested_items: Prisma.FieldRef<"RestockRequest", 'Json'>;
    readonly status: Prisma.FieldRef<"RestockRequest", 'String'>;
    readonly catatan: Prisma.FieldRef<"RestockRequest", 'String'>;
    readonly reviewed_by: Prisma.FieldRef<"RestockRequest", 'String'>;
    readonly reviewed_at: Prisma.FieldRef<"RestockRequest", 'DateTime'>;
    readonly created_at: Prisma.FieldRef<"RestockRequest", 'DateTime'>;
}
/**
 * RestockRequest findUnique
 */
export type RestockRequestFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which RestockRequest to fetch.
     */
    where: Prisma.RestockRequestWhereUniqueInput;
};
/**
 * RestockRequest findUniqueOrThrow
 */
export type RestockRequestFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which RestockRequest to fetch.
     */
    where: Prisma.RestockRequestWhereUniqueInput;
};
/**
 * RestockRequest findFirst
 */
export type RestockRequestFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which RestockRequest to fetch.
     */
    where?: Prisma.RestockRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RestockRequests to fetch.
     */
    orderBy?: Prisma.RestockRequestOrderByWithRelationInput | Prisma.RestockRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RestockRequests.
     */
    cursor?: Prisma.RestockRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RestockRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RestockRequests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RestockRequests.
     */
    distinct?: Prisma.RestockRequestScalarFieldEnum | Prisma.RestockRequestScalarFieldEnum[];
};
/**
 * RestockRequest findFirstOrThrow
 */
export type RestockRequestFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which RestockRequest to fetch.
     */
    where?: Prisma.RestockRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RestockRequests to fetch.
     */
    orderBy?: Prisma.RestockRequestOrderByWithRelationInput | Prisma.RestockRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RestockRequests.
     */
    cursor?: Prisma.RestockRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RestockRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RestockRequests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RestockRequests.
     */
    distinct?: Prisma.RestockRequestScalarFieldEnum | Prisma.RestockRequestScalarFieldEnum[];
};
/**
 * RestockRequest findMany
 */
export type RestockRequestFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which RestockRequests to fetch.
     */
    where?: Prisma.RestockRequestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RestockRequests to fetch.
     */
    orderBy?: Prisma.RestockRequestOrderByWithRelationInput | Prisma.RestockRequestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing RestockRequests.
     */
    cursor?: Prisma.RestockRequestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RestockRequests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RestockRequests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RestockRequests.
     */
    distinct?: Prisma.RestockRequestScalarFieldEnum | Prisma.RestockRequestScalarFieldEnum[];
};
/**
 * RestockRequest create
 */
export type RestockRequestCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a RestockRequest.
     */
    data: Prisma.XOR<Prisma.RestockRequestCreateInput, Prisma.RestockRequestUncheckedCreateInput>;
};
/**
 * RestockRequest createMany
 */
export type RestockRequestCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many RestockRequests.
     */
    data: Prisma.RestockRequestCreateManyInput | Prisma.RestockRequestCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * RestockRequest createManyAndReturn
 */
export type RestockRequestCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestockRequest
     */
    select?: Prisma.RestockRequestSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RestockRequest
     */
    omit?: Prisma.RestockRequestOmit<ExtArgs> | null;
    /**
     * The data used to create many RestockRequests.
     */
    data: Prisma.RestockRequestCreateManyInput | Prisma.RestockRequestCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RestockRequestIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * RestockRequest update
 */
export type RestockRequestUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a RestockRequest.
     */
    data: Prisma.XOR<Prisma.RestockRequestUpdateInput, Prisma.RestockRequestUncheckedUpdateInput>;
    /**
     * Choose, which RestockRequest to update.
     */
    where: Prisma.RestockRequestWhereUniqueInput;
};
/**
 * RestockRequest updateMany
 */
export type RestockRequestUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update RestockRequests.
     */
    data: Prisma.XOR<Prisma.RestockRequestUpdateManyMutationInput, Prisma.RestockRequestUncheckedUpdateManyInput>;
    /**
     * Filter which RestockRequests to update
     */
    where?: Prisma.RestockRequestWhereInput;
    /**
     * Limit how many RestockRequests to update.
     */
    limit?: number;
};
/**
 * RestockRequest updateManyAndReturn
 */
export type RestockRequestUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestockRequest
     */
    select?: Prisma.RestockRequestSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RestockRequest
     */
    omit?: Prisma.RestockRequestOmit<ExtArgs> | null;
    /**
     * The data used to update RestockRequests.
     */
    data: Prisma.XOR<Prisma.RestockRequestUpdateManyMutationInput, Prisma.RestockRequestUncheckedUpdateManyInput>;
    /**
     * Filter which RestockRequests to update
     */
    where?: Prisma.RestockRequestWhereInput;
    /**
     * Limit how many RestockRequests to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RestockRequestIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * RestockRequest upsert
 */
export type RestockRequestUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the RestockRequest to update in case it exists.
     */
    where: Prisma.RestockRequestWhereUniqueInput;
    /**
     * In case the RestockRequest found by the `where` argument doesn't exist, create a new RestockRequest with this data.
     */
    create: Prisma.XOR<Prisma.RestockRequestCreateInput, Prisma.RestockRequestUncheckedCreateInput>;
    /**
     * In case the RestockRequest was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.RestockRequestUpdateInput, Prisma.RestockRequestUncheckedUpdateInput>;
};
/**
 * RestockRequest delete
 */
export type RestockRequestDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which RestockRequest to delete.
     */
    where: Prisma.RestockRequestWhereUniqueInput;
};
/**
 * RestockRequest deleteMany
 */
export type RestockRequestDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which RestockRequests to delete
     */
    where?: Prisma.RestockRequestWhereInput;
    /**
     * Limit how many RestockRequests to delete.
     */
    limit?: number;
};
/**
 * RestockRequest without action
 */
export type RestockRequestDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
//# sourceMappingURL=RestockRequest.d.ts.map