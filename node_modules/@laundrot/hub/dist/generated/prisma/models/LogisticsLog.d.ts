import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model LogisticsLog
 *
 */
export type LogisticsLogModel = runtime.Types.Result.DefaultSelection<Prisma.$LogisticsLogPayload>;
export type AggregateLogisticsLog = {
    _count: LogisticsLogCountAggregateOutputType | null;
    _min: LogisticsLogMinAggregateOutputType | null;
    _max: LogisticsLogMaxAggregateOutputType | null;
};
export type LogisticsLogMinAggregateOutputType = {
    id: string | null;
    id_cabang: string | null;
    status: string | null;
    timestamp: Date | null;
};
export type LogisticsLogMaxAggregateOutputType = {
    id: string | null;
    id_cabang: string | null;
    status: string | null;
    timestamp: Date | null;
};
export type LogisticsLogCountAggregateOutputType = {
    id: number;
    id_cabang: number;
    sent_items: number;
    received_items: number;
    discrepancy: number;
    status: number;
    timestamp: number;
    _all: number;
};
export type LogisticsLogMinAggregateInputType = {
    id?: true;
    id_cabang?: true;
    status?: true;
    timestamp?: true;
};
export type LogisticsLogMaxAggregateInputType = {
    id?: true;
    id_cabang?: true;
    status?: true;
    timestamp?: true;
};
export type LogisticsLogCountAggregateInputType = {
    id?: true;
    id_cabang?: true;
    sent_items?: true;
    received_items?: true;
    discrepancy?: true;
    status?: true;
    timestamp?: true;
    _all?: true;
};
export type LogisticsLogAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which LogisticsLog to aggregate.
     */
    where?: Prisma.LogisticsLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LogisticsLogs to fetch.
     */
    orderBy?: Prisma.LogisticsLogOrderByWithRelationInput | Prisma.LogisticsLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.LogisticsLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LogisticsLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LogisticsLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned LogisticsLogs
    **/
    _count?: true | LogisticsLogCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: LogisticsLogMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: LogisticsLogMaxAggregateInputType;
};
export type GetLogisticsLogAggregateType<T extends LogisticsLogAggregateArgs> = {
    [P in keyof T & keyof AggregateLogisticsLog]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLogisticsLog[P]> : Prisma.GetScalarType<T[P], AggregateLogisticsLog[P]>;
};
export type LogisticsLogGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LogisticsLogWhereInput;
    orderBy?: Prisma.LogisticsLogOrderByWithAggregationInput | Prisma.LogisticsLogOrderByWithAggregationInput[];
    by: Prisma.LogisticsLogScalarFieldEnum[] | Prisma.LogisticsLogScalarFieldEnum;
    having?: Prisma.LogisticsLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LogisticsLogCountAggregateInputType | true;
    _min?: LogisticsLogMinAggregateInputType;
    _max?: LogisticsLogMaxAggregateInputType;
};
export type LogisticsLogGroupByOutputType = {
    id: string;
    id_cabang: string;
    sent_items: runtime.JsonValue;
    received_items: runtime.JsonValue | null;
    discrepancy: runtime.JsonValue | null;
    status: string;
    timestamp: Date;
    _count: LogisticsLogCountAggregateOutputType | null;
    _min: LogisticsLogMinAggregateOutputType | null;
    _max: LogisticsLogMaxAggregateOutputType | null;
};
export type GetLogisticsLogGroupByPayload<T extends LogisticsLogGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LogisticsLogGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LogisticsLogGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LogisticsLogGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LogisticsLogGroupByOutputType[P]>;
}>>;
export type LogisticsLogWhereInput = {
    AND?: Prisma.LogisticsLogWhereInput | Prisma.LogisticsLogWhereInput[];
    OR?: Prisma.LogisticsLogWhereInput[];
    NOT?: Prisma.LogisticsLogWhereInput | Prisma.LogisticsLogWhereInput[];
    id?: Prisma.StringFilter<"LogisticsLog"> | string;
    id_cabang?: Prisma.StringFilter<"LogisticsLog"> | string;
    sent_items?: Prisma.JsonFilter<"LogisticsLog">;
    received_items?: Prisma.JsonNullableFilter<"LogisticsLog">;
    discrepancy?: Prisma.JsonNullableFilter<"LogisticsLog">;
    status?: Prisma.StringFilter<"LogisticsLog"> | string;
    timestamp?: Prisma.DateTimeFilter<"LogisticsLog"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
};
export type LogisticsLogOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    sent_items?: Prisma.SortOrder;
    received_items?: Prisma.SortOrderInput | Prisma.SortOrder;
    discrepancy?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    branch?: Prisma.BranchOrderByWithRelationInput;
};
export type LogisticsLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.LogisticsLogWhereInput | Prisma.LogisticsLogWhereInput[];
    OR?: Prisma.LogisticsLogWhereInput[];
    NOT?: Prisma.LogisticsLogWhereInput | Prisma.LogisticsLogWhereInput[];
    id_cabang?: Prisma.StringFilter<"LogisticsLog"> | string;
    sent_items?: Prisma.JsonFilter<"LogisticsLog">;
    received_items?: Prisma.JsonNullableFilter<"LogisticsLog">;
    discrepancy?: Prisma.JsonNullableFilter<"LogisticsLog">;
    status?: Prisma.StringFilter<"LogisticsLog"> | string;
    timestamp?: Prisma.DateTimeFilter<"LogisticsLog"> | Date | string;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
}, "id">;
export type LogisticsLogOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    sent_items?: Prisma.SortOrder;
    received_items?: Prisma.SortOrderInput | Prisma.SortOrder;
    discrepancy?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    _count?: Prisma.LogisticsLogCountOrderByAggregateInput;
    _max?: Prisma.LogisticsLogMaxOrderByAggregateInput;
    _min?: Prisma.LogisticsLogMinOrderByAggregateInput;
};
export type LogisticsLogScalarWhereWithAggregatesInput = {
    AND?: Prisma.LogisticsLogScalarWhereWithAggregatesInput | Prisma.LogisticsLogScalarWhereWithAggregatesInput[];
    OR?: Prisma.LogisticsLogScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LogisticsLogScalarWhereWithAggregatesInput | Prisma.LogisticsLogScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"LogisticsLog"> | string;
    id_cabang?: Prisma.StringWithAggregatesFilter<"LogisticsLog"> | string;
    sent_items?: Prisma.JsonWithAggregatesFilter<"LogisticsLog">;
    received_items?: Prisma.JsonNullableWithAggregatesFilter<"LogisticsLog">;
    discrepancy?: Prisma.JsonNullableWithAggregatesFilter<"LogisticsLog">;
    status?: Prisma.StringWithAggregatesFilter<"LogisticsLog"> | string;
    timestamp?: Prisma.DateTimeWithAggregatesFilter<"LogisticsLog"> | Date | string;
};
export type LogisticsLogCreateInput = {
    id?: string;
    sent_items: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    received_items?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    discrepancy?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    timestamp?: Date | string;
    branch: Prisma.BranchCreateNestedOneWithoutLogistics_logsInput;
};
export type LogisticsLogUncheckedCreateInput = {
    id?: string;
    id_cabang: string;
    sent_items: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    received_items?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    discrepancy?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    timestamp?: Date | string;
};
export type LogisticsLogUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sent_items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    received_items?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    discrepancy?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    branch?: Prisma.BranchUpdateOneRequiredWithoutLogistics_logsNestedInput;
};
export type LogisticsLogUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    sent_items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    received_items?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    discrepancy?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LogisticsLogCreateManyInput = {
    id?: string;
    id_cabang: string;
    sent_items: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    received_items?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    discrepancy?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    timestamp?: Date | string;
};
export type LogisticsLogUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sent_items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    received_items?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    discrepancy?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LogisticsLogUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    sent_items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    received_items?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    discrepancy?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LogisticsLogListRelationFilter = {
    every?: Prisma.LogisticsLogWhereInput;
    some?: Prisma.LogisticsLogWhereInput;
    none?: Prisma.LogisticsLogWhereInput;
};
export type LogisticsLogOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LogisticsLogCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    sent_items?: Prisma.SortOrder;
    received_items?: Prisma.SortOrder;
    discrepancy?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type LogisticsLogMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type LogisticsLogMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type LogisticsLogCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.LogisticsLogCreateWithoutBranchInput, Prisma.LogisticsLogUncheckedCreateWithoutBranchInput> | Prisma.LogisticsLogCreateWithoutBranchInput[] | Prisma.LogisticsLogUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.LogisticsLogCreateOrConnectWithoutBranchInput | Prisma.LogisticsLogCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.LogisticsLogCreateManyBranchInputEnvelope;
    connect?: Prisma.LogisticsLogWhereUniqueInput | Prisma.LogisticsLogWhereUniqueInput[];
};
export type LogisticsLogUncheckedCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.LogisticsLogCreateWithoutBranchInput, Prisma.LogisticsLogUncheckedCreateWithoutBranchInput> | Prisma.LogisticsLogCreateWithoutBranchInput[] | Prisma.LogisticsLogUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.LogisticsLogCreateOrConnectWithoutBranchInput | Prisma.LogisticsLogCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.LogisticsLogCreateManyBranchInputEnvelope;
    connect?: Prisma.LogisticsLogWhereUniqueInput | Prisma.LogisticsLogWhereUniqueInput[];
};
export type LogisticsLogUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.LogisticsLogCreateWithoutBranchInput, Prisma.LogisticsLogUncheckedCreateWithoutBranchInput> | Prisma.LogisticsLogCreateWithoutBranchInput[] | Prisma.LogisticsLogUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.LogisticsLogCreateOrConnectWithoutBranchInput | Prisma.LogisticsLogCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.LogisticsLogUpsertWithWhereUniqueWithoutBranchInput | Prisma.LogisticsLogUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.LogisticsLogCreateManyBranchInputEnvelope;
    set?: Prisma.LogisticsLogWhereUniqueInput | Prisma.LogisticsLogWhereUniqueInput[];
    disconnect?: Prisma.LogisticsLogWhereUniqueInput | Prisma.LogisticsLogWhereUniqueInput[];
    delete?: Prisma.LogisticsLogWhereUniqueInput | Prisma.LogisticsLogWhereUniqueInput[];
    connect?: Prisma.LogisticsLogWhereUniqueInput | Prisma.LogisticsLogWhereUniqueInput[];
    update?: Prisma.LogisticsLogUpdateWithWhereUniqueWithoutBranchInput | Prisma.LogisticsLogUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.LogisticsLogUpdateManyWithWhereWithoutBranchInput | Prisma.LogisticsLogUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.LogisticsLogScalarWhereInput | Prisma.LogisticsLogScalarWhereInput[];
};
export type LogisticsLogUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.LogisticsLogCreateWithoutBranchInput, Prisma.LogisticsLogUncheckedCreateWithoutBranchInput> | Prisma.LogisticsLogCreateWithoutBranchInput[] | Prisma.LogisticsLogUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.LogisticsLogCreateOrConnectWithoutBranchInput | Prisma.LogisticsLogCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.LogisticsLogUpsertWithWhereUniqueWithoutBranchInput | Prisma.LogisticsLogUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.LogisticsLogCreateManyBranchInputEnvelope;
    set?: Prisma.LogisticsLogWhereUniqueInput | Prisma.LogisticsLogWhereUniqueInput[];
    disconnect?: Prisma.LogisticsLogWhereUniqueInput | Prisma.LogisticsLogWhereUniqueInput[];
    delete?: Prisma.LogisticsLogWhereUniqueInput | Prisma.LogisticsLogWhereUniqueInput[];
    connect?: Prisma.LogisticsLogWhereUniqueInput | Prisma.LogisticsLogWhereUniqueInput[];
    update?: Prisma.LogisticsLogUpdateWithWhereUniqueWithoutBranchInput | Prisma.LogisticsLogUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.LogisticsLogUpdateManyWithWhereWithoutBranchInput | Prisma.LogisticsLogUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.LogisticsLogScalarWhereInput | Prisma.LogisticsLogScalarWhereInput[];
};
export type LogisticsLogCreateWithoutBranchInput = {
    id?: string;
    sent_items: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    received_items?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    discrepancy?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    timestamp?: Date | string;
};
export type LogisticsLogUncheckedCreateWithoutBranchInput = {
    id?: string;
    sent_items: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    received_items?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    discrepancy?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    timestamp?: Date | string;
};
export type LogisticsLogCreateOrConnectWithoutBranchInput = {
    where: Prisma.LogisticsLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.LogisticsLogCreateWithoutBranchInput, Prisma.LogisticsLogUncheckedCreateWithoutBranchInput>;
};
export type LogisticsLogCreateManyBranchInputEnvelope = {
    data: Prisma.LogisticsLogCreateManyBranchInput | Prisma.LogisticsLogCreateManyBranchInput[];
    skipDuplicates?: boolean;
};
export type LogisticsLogUpsertWithWhereUniqueWithoutBranchInput = {
    where: Prisma.LogisticsLogWhereUniqueInput;
    update: Prisma.XOR<Prisma.LogisticsLogUpdateWithoutBranchInput, Prisma.LogisticsLogUncheckedUpdateWithoutBranchInput>;
    create: Prisma.XOR<Prisma.LogisticsLogCreateWithoutBranchInput, Prisma.LogisticsLogUncheckedCreateWithoutBranchInput>;
};
export type LogisticsLogUpdateWithWhereUniqueWithoutBranchInput = {
    where: Prisma.LogisticsLogWhereUniqueInput;
    data: Prisma.XOR<Prisma.LogisticsLogUpdateWithoutBranchInput, Prisma.LogisticsLogUncheckedUpdateWithoutBranchInput>;
};
export type LogisticsLogUpdateManyWithWhereWithoutBranchInput = {
    where: Prisma.LogisticsLogScalarWhereInput;
    data: Prisma.XOR<Prisma.LogisticsLogUpdateManyMutationInput, Prisma.LogisticsLogUncheckedUpdateManyWithoutBranchInput>;
};
export type LogisticsLogScalarWhereInput = {
    AND?: Prisma.LogisticsLogScalarWhereInput | Prisma.LogisticsLogScalarWhereInput[];
    OR?: Prisma.LogisticsLogScalarWhereInput[];
    NOT?: Prisma.LogisticsLogScalarWhereInput | Prisma.LogisticsLogScalarWhereInput[];
    id?: Prisma.StringFilter<"LogisticsLog"> | string;
    id_cabang?: Prisma.StringFilter<"LogisticsLog"> | string;
    sent_items?: Prisma.JsonFilter<"LogisticsLog">;
    received_items?: Prisma.JsonNullableFilter<"LogisticsLog">;
    discrepancy?: Prisma.JsonNullableFilter<"LogisticsLog">;
    status?: Prisma.StringFilter<"LogisticsLog"> | string;
    timestamp?: Prisma.DateTimeFilter<"LogisticsLog"> | Date | string;
};
export type LogisticsLogCreateManyBranchInput = {
    id?: string;
    sent_items: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    received_items?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    discrepancy?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: string;
    timestamp?: Date | string;
};
export type LogisticsLogUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sent_items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    received_items?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    discrepancy?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LogisticsLogUncheckedUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sent_items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    received_items?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    discrepancy?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LogisticsLogUncheckedUpdateManyWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sent_items?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    received_items?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    discrepancy?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LogisticsLogSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    id_cabang?: boolean;
    sent_items?: boolean;
    received_items?: boolean;
    discrepancy?: boolean;
    status?: boolean;
    timestamp?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["logisticsLog"]>;
export type LogisticsLogSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    id_cabang?: boolean;
    sent_items?: boolean;
    received_items?: boolean;
    discrepancy?: boolean;
    status?: boolean;
    timestamp?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["logisticsLog"]>;
export type LogisticsLogSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    id_cabang?: boolean;
    sent_items?: boolean;
    received_items?: boolean;
    discrepancy?: boolean;
    status?: boolean;
    timestamp?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["logisticsLog"]>;
export type LogisticsLogSelectScalar = {
    id?: boolean;
    id_cabang?: boolean;
    sent_items?: boolean;
    received_items?: boolean;
    discrepancy?: boolean;
    status?: boolean;
    timestamp?: boolean;
};
export type LogisticsLogOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "id_cabang" | "sent_items" | "received_items" | "discrepancy" | "status" | "timestamp", ExtArgs["result"]["logisticsLog"]>;
export type LogisticsLogInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type LogisticsLogIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type LogisticsLogIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type $LogisticsLogPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LogisticsLog";
    objects: {
        branch: Prisma.$BranchPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        id_cabang: string;
        sent_items: runtime.JsonValue;
        received_items: runtime.JsonValue | null;
        discrepancy: runtime.JsonValue | null;
        status: string;
        timestamp: Date;
    }, ExtArgs["result"]["logisticsLog"]>;
    composites: {};
};
export type LogisticsLogGetPayload<S extends boolean | null | undefined | LogisticsLogDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LogisticsLogPayload, S>;
export type LogisticsLogCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LogisticsLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LogisticsLogCountAggregateInputType | true;
};
export interface LogisticsLogDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LogisticsLog'];
        meta: {
            name: 'LogisticsLog';
        };
    };
    /**
     * Find zero or one LogisticsLog that matches the filter.
     * @param {LogisticsLogFindUniqueArgs} args - Arguments to find a LogisticsLog
     * @example
     * // Get one LogisticsLog
     * const logisticsLog = await prisma.logisticsLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LogisticsLogFindUniqueArgs>(args: Prisma.SelectSubset<T, LogisticsLogFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LogisticsLogClient<runtime.Types.Result.GetResult<Prisma.$LogisticsLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one LogisticsLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LogisticsLogFindUniqueOrThrowArgs} args - Arguments to find a LogisticsLog
     * @example
     * // Get one LogisticsLog
     * const logisticsLog = await prisma.logisticsLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LogisticsLogFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LogisticsLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LogisticsLogClient<runtime.Types.Result.GetResult<Prisma.$LogisticsLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first LogisticsLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsLogFindFirstArgs} args - Arguments to find a LogisticsLog
     * @example
     * // Get one LogisticsLog
     * const logisticsLog = await prisma.logisticsLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LogisticsLogFindFirstArgs>(args?: Prisma.SelectSubset<T, LogisticsLogFindFirstArgs<ExtArgs>>): Prisma.Prisma__LogisticsLogClient<runtime.Types.Result.GetResult<Prisma.$LogisticsLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first LogisticsLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsLogFindFirstOrThrowArgs} args - Arguments to find a LogisticsLog
     * @example
     * // Get one LogisticsLog
     * const logisticsLog = await prisma.logisticsLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LogisticsLogFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LogisticsLogFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LogisticsLogClient<runtime.Types.Result.GetResult<Prisma.$LogisticsLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more LogisticsLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LogisticsLogs
     * const logisticsLogs = await prisma.logisticsLog.findMany()
     *
     * // Get first 10 LogisticsLogs
     * const logisticsLogs = await prisma.logisticsLog.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const logisticsLogWithIdOnly = await prisma.logisticsLog.findMany({ select: { id: true } })
     *
     */
    findMany<T extends LogisticsLogFindManyArgs>(args?: Prisma.SelectSubset<T, LogisticsLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LogisticsLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a LogisticsLog.
     * @param {LogisticsLogCreateArgs} args - Arguments to create a LogisticsLog.
     * @example
     * // Create one LogisticsLog
     * const LogisticsLog = await prisma.logisticsLog.create({
     *   data: {
     *     // ... data to create a LogisticsLog
     *   }
     * })
     *
     */
    create<T extends LogisticsLogCreateArgs>(args: Prisma.SelectSubset<T, LogisticsLogCreateArgs<ExtArgs>>): Prisma.Prisma__LogisticsLogClient<runtime.Types.Result.GetResult<Prisma.$LogisticsLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many LogisticsLogs.
     * @param {LogisticsLogCreateManyArgs} args - Arguments to create many LogisticsLogs.
     * @example
     * // Create many LogisticsLogs
     * const logisticsLog = await prisma.logisticsLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends LogisticsLogCreateManyArgs>(args?: Prisma.SelectSubset<T, LogisticsLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many LogisticsLogs and returns the data saved in the database.
     * @param {LogisticsLogCreateManyAndReturnArgs} args - Arguments to create many LogisticsLogs.
     * @example
     * // Create many LogisticsLogs
     * const logisticsLog = await prisma.logisticsLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many LogisticsLogs and only return the `id`
     * const logisticsLogWithIdOnly = await prisma.logisticsLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends LogisticsLogCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LogisticsLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LogisticsLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a LogisticsLog.
     * @param {LogisticsLogDeleteArgs} args - Arguments to delete one LogisticsLog.
     * @example
     * // Delete one LogisticsLog
     * const LogisticsLog = await prisma.logisticsLog.delete({
     *   where: {
     *     // ... filter to delete one LogisticsLog
     *   }
     * })
     *
     */
    delete<T extends LogisticsLogDeleteArgs>(args: Prisma.SelectSubset<T, LogisticsLogDeleteArgs<ExtArgs>>): Prisma.Prisma__LogisticsLogClient<runtime.Types.Result.GetResult<Prisma.$LogisticsLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one LogisticsLog.
     * @param {LogisticsLogUpdateArgs} args - Arguments to update one LogisticsLog.
     * @example
     * // Update one LogisticsLog
     * const logisticsLog = await prisma.logisticsLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends LogisticsLogUpdateArgs>(args: Prisma.SelectSubset<T, LogisticsLogUpdateArgs<ExtArgs>>): Prisma.Prisma__LogisticsLogClient<runtime.Types.Result.GetResult<Prisma.$LogisticsLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more LogisticsLogs.
     * @param {LogisticsLogDeleteManyArgs} args - Arguments to filter LogisticsLogs to delete.
     * @example
     * // Delete a few LogisticsLogs
     * const { count } = await prisma.logisticsLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends LogisticsLogDeleteManyArgs>(args?: Prisma.SelectSubset<T, LogisticsLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more LogisticsLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LogisticsLogs
     * const logisticsLog = await prisma.logisticsLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends LogisticsLogUpdateManyArgs>(args: Prisma.SelectSubset<T, LogisticsLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more LogisticsLogs and returns the data updated in the database.
     * @param {LogisticsLogUpdateManyAndReturnArgs} args - Arguments to update many LogisticsLogs.
     * @example
     * // Update many LogisticsLogs
     * const logisticsLog = await prisma.logisticsLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more LogisticsLogs and only return the `id`
     * const logisticsLogWithIdOnly = await prisma.logisticsLog.updateManyAndReturn({
     *   select: { id: true },
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
    updateManyAndReturn<T extends LogisticsLogUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LogisticsLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LogisticsLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one LogisticsLog.
     * @param {LogisticsLogUpsertArgs} args - Arguments to update or create a LogisticsLog.
     * @example
     * // Update or create a LogisticsLog
     * const logisticsLog = await prisma.logisticsLog.upsert({
     *   create: {
     *     // ... data to create a LogisticsLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LogisticsLog we want to update
     *   }
     * })
     */
    upsert<T extends LogisticsLogUpsertArgs>(args: Prisma.SelectSubset<T, LogisticsLogUpsertArgs<ExtArgs>>): Prisma.Prisma__LogisticsLogClient<runtime.Types.Result.GetResult<Prisma.$LogisticsLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of LogisticsLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsLogCountArgs} args - Arguments to filter LogisticsLogs to count.
     * @example
     * // Count the number of LogisticsLogs
     * const count = await prisma.logisticsLog.count({
     *   where: {
     *     // ... the filter for the LogisticsLogs we want to count
     *   }
     * })
    **/
    count<T extends LogisticsLogCountArgs>(args?: Prisma.Subset<T, LogisticsLogCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LogisticsLogCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a LogisticsLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LogisticsLogAggregateArgs>(args: Prisma.Subset<T, LogisticsLogAggregateArgs>): Prisma.PrismaPromise<GetLogisticsLogAggregateType<T>>;
    /**
     * Group by LogisticsLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LogisticsLogGroupByArgs} args - Group by arguments.
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
    groupBy<T extends LogisticsLogGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LogisticsLogGroupByArgs['orderBy'];
    } : {
        orderBy?: LogisticsLogGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LogisticsLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLogisticsLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the LogisticsLog model
     */
    readonly fields: LogisticsLogFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for LogisticsLog.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__LogisticsLogClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
 * Fields of the LogisticsLog model
 */
export interface LogisticsLogFieldRefs {
    readonly id: Prisma.FieldRef<"LogisticsLog", 'String'>;
    readonly id_cabang: Prisma.FieldRef<"LogisticsLog", 'String'>;
    readonly sent_items: Prisma.FieldRef<"LogisticsLog", 'Json'>;
    readonly received_items: Prisma.FieldRef<"LogisticsLog", 'Json'>;
    readonly discrepancy: Prisma.FieldRef<"LogisticsLog", 'Json'>;
    readonly status: Prisma.FieldRef<"LogisticsLog", 'String'>;
    readonly timestamp: Prisma.FieldRef<"LogisticsLog", 'DateTime'>;
}
/**
 * LogisticsLog findUnique
 */
export type LogisticsLogFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which LogisticsLog to fetch.
     */
    where: Prisma.LogisticsLogWhereUniqueInput;
};
/**
 * LogisticsLog findUniqueOrThrow
 */
export type LogisticsLogFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which LogisticsLog to fetch.
     */
    where: Prisma.LogisticsLogWhereUniqueInput;
};
/**
 * LogisticsLog findFirst
 */
export type LogisticsLogFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which LogisticsLog to fetch.
     */
    where?: Prisma.LogisticsLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LogisticsLogs to fetch.
     */
    orderBy?: Prisma.LogisticsLogOrderByWithRelationInput | Prisma.LogisticsLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for LogisticsLogs.
     */
    cursor?: Prisma.LogisticsLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LogisticsLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LogisticsLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of LogisticsLogs.
     */
    distinct?: Prisma.LogisticsLogScalarFieldEnum | Prisma.LogisticsLogScalarFieldEnum[];
};
/**
 * LogisticsLog findFirstOrThrow
 */
export type LogisticsLogFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which LogisticsLog to fetch.
     */
    where?: Prisma.LogisticsLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LogisticsLogs to fetch.
     */
    orderBy?: Prisma.LogisticsLogOrderByWithRelationInput | Prisma.LogisticsLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for LogisticsLogs.
     */
    cursor?: Prisma.LogisticsLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LogisticsLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LogisticsLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of LogisticsLogs.
     */
    distinct?: Prisma.LogisticsLogScalarFieldEnum | Prisma.LogisticsLogScalarFieldEnum[];
};
/**
 * LogisticsLog findMany
 */
export type LogisticsLogFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which LogisticsLogs to fetch.
     */
    where?: Prisma.LogisticsLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LogisticsLogs to fetch.
     */
    orderBy?: Prisma.LogisticsLogOrderByWithRelationInput | Prisma.LogisticsLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing LogisticsLogs.
     */
    cursor?: Prisma.LogisticsLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LogisticsLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LogisticsLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of LogisticsLogs.
     */
    distinct?: Prisma.LogisticsLogScalarFieldEnum | Prisma.LogisticsLogScalarFieldEnum[];
};
/**
 * LogisticsLog create
 */
export type LogisticsLogCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a LogisticsLog.
     */
    data: Prisma.XOR<Prisma.LogisticsLogCreateInput, Prisma.LogisticsLogUncheckedCreateInput>;
};
/**
 * LogisticsLog createMany
 */
export type LogisticsLogCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many LogisticsLogs.
     */
    data: Prisma.LogisticsLogCreateManyInput | Prisma.LogisticsLogCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * LogisticsLog createManyAndReturn
 */
export type LogisticsLogCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogisticsLog
     */
    select?: Prisma.LogisticsLogSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the LogisticsLog
     */
    omit?: Prisma.LogisticsLogOmit<ExtArgs> | null;
    /**
     * The data used to create many LogisticsLogs.
     */
    data: Prisma.LogisticsLogCreateManyInput | Prisma.LogisticsLogCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.LogisticsLogIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * LogisticsLog update
 */
export type LogisticsLogUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a LogisticsLog.
     */
    data: Prisma.XOR<Prisma.LogisticsLogUpdateInput, Prisma.LogisticsLogUncheckedUpdateInput>;
    /**
     * Choose, which LogisticsLog to update.
     */
    where: Prisma.LogisticsLogWhereUniqueInput;
};
/**
 * LogisticsLog updateMany
 */
export type LogisticsLogUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update LogisticsLogs.
     */
    data: Prisma.XOR<Prisma.LogisticsLogUpdateManyMutationInput, Prisma.LogisticsLogUncheckedUpdateManyInput>;
    /**
     * Filter which LogisticsLogs to update
     */
    where?: Prisma.LogisticsLogWhereInput;
    /**
     * Limit how many LogisticsLogs to update.
     */
    limit?: number;
};
/**
 * LogisticsLog updateManyAndReturn
 */
export type LogisticsLogUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LogisticsLog
     */
    select?: Prisma.LogisticsLogSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the LogisticsLog
     */
    omit?: Prisma.LogisticsLogOmit<ExtArgs> | null;
    /**
     * The data used to update LogisticsLogs.
     */
    data: Prisma.XOR<Prisma.LogisticsLogUpdateManyMutationInput, Prisma.LogisticsLogUncheckedUpdateManyInput>;
    /**
     * Filter which LogisticsLogs to update
     */
    where?: Prisma.LogisticsLogWhereInput;
    /**
     * Limit how many LogisticsLogs to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.LogisticsLogIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * LogisticsLog upsert
 */
export type LogisticsLogUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the LogisticsLog to update in case it exists.
     */
    where: Prisma.LogisticsLogWhereUniqueInput;
    /**
     * In case the LogisticsLog found by the `where` argument doesn't exist, create a new LogisticsLog with this data.
     */
    create: Prisma.XOR<Prisma.LogisticsLogCreateInput, Prisma.LogisticsLogUncheckedCreateInput>;
    /**
     * In case the LogisticsLog was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.LogisticsLogUpdateInput, Prisma.LogisticsLogUncheckedUpdateInput>;
};
/**
 * LogisticsLog delete
 */
export type LogisticsLogDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which LogisticsLog to delete.
     */
    where: Prisma.LogisticsLogWhereUniqueInput;
};
/**
 * LogisticsLog deleteMany
 */
export type LogisticsLogDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which LogisticsLogs to delete
     */
    where?: Prisma.LogisticsLogWhereInput;
    /**
     * Limit how many LogisticsLogs to delete.
     */
    limit?: number;
};
/**
 * LogisticsLog without action
 */
export type LogisticsLogDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
//# sourceMappingURL=LogisticsLog.d.ts.map