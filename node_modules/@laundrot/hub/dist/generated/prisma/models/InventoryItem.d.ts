import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model InventoryItem
 *
 */
export type InventoryItemModel = runtime.Types.Result.DefaultSelection<Prisma.$InventoryItemPayload>;
export type AggregateInventoryItem = {
    _count: InventoryItemCountAggregateOutputType | null;
    _avg: InventoryItemAvgAggregateOutputType | null;
    _sum: InventoryItemSumAggregateOutputType | null;
    _min: InventoryItemMinAggregateOutputType | null;
    _max: InventoryItemMaxAggregateOutputType | null;
};
export type InventoryItemAvgAggregateOutputType = {
    stok_saat_ini: number | null;
    safety_threshold: number | null;
    max_capacity: number | null;
};
export type InventoryItemSumAggregateOutputType = {
    stok_saat_ini: number | null;
    safety_threshold: number | null;
    max_capacity: number | null;
};
export type InventoryItemMinAggregateOutputType = {
    id: string | null;
    id_cabang: string | null;
    item: string | null;
    satuan: string | null;
    stok_saat_ini: number | null;
    safety_threshold: number | null;
    max_capacity: number | null;
};
export type InventoryItemMaxAggregateOutputType = {
    id: string | null;
    id_cabang: string | null;
    item: string | null;
    satuan: string | null;
    stok_saat_ini: number | null;
    safety_threshold: number | null;
    max_capacity: number | null;
};
export type InventoryItemCountAggregateOutputType = {
    id: number;
    id_cabang: number;
    item: number;
    satuan: number;
    stok_saat_ini: number;
    safety_threshold: number;
    max_capacity: number;
    _all: number;
};
export type InventoryItemAvgAggregateInputType = {
    stok_saat_ini?: true;
    safety_threshold?: true;
    max_capacity?: true;
};
export type InventoryItemSumAggregateInputType = {
    stok_saat_ini?: true;
    safety_threshold?: true;
    max_capacity?: true;
};
export type InventoryItemMinAggregateInputType = {
    id?: true;
    id_cabang?: true;
    item?: true;
    satuan?: true;
    stok_saat_ini?: true;
    safety_threshold?: true;
    max_capacity?: true;
};
export type InventoryItemMaxAggregateInputType = {
    id?: true;
    id_cabang?: true;
    item?: true;
    satuan?: true;
    stok_saat_ini?: true;
    safety_threshold?: true;
    max_capacity?: true;
};
export type InventoryItemCountAggregateInputType = {
    id?: true;
    id_cabang?: true;
    item?: true;
    satuan?: true;
    stok_saat_ini?: true;
    safety_threshold?: true;
    max_capacity?: true;
    _all?: true;
};
export type InventoryItemAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryItem to aggregate.
     */
    where?: Prisma.InventoryItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: Prisma.InventoryItemOrderByWithRelationInput | Prisma.InventoryItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.InventoryItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InventoryItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned InventoryItems
    **/
    _count?: true | InventoryItemCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: InventoryItemAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: InventoryItemSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: InventoryItemMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: InventoryItemMaxAggregateInputType;
};
export type GetInventoryItemAggregateType<T extends InventoryItemAggregateArgs> = {
    [P in keyof T & keyof AggregateInventoryItem]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateInventoryItem[P]> : Prisma.GetScalarType<T[P], AggregateInventoryItem[P]>;
};
export type InventoryItemGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryItemWhereInput;
    orderBy?: Prisma.InventoryItemOrderByWithAggregationInput | Prisma.InventoryItemOrderByWithAggregationInput[];
    by: Prisma.InventoryItemScalarFieldEnum[] | Prisma.InventoryItemScalarFieldEnum;
    having?: Prisma.InventoryItemScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: InventoryItemCountAggregateInputType | true;
    _avg?: InventoryItemAvgAggregateInputType;
    _sum?: InventoryItemSumAggregateInputType;
    _min?: InventoryItemMinAggregateInputType;
    _max?: InventoryItemMaxAggregateInputType;
};
export type InventoryItemGroupByOutputType = {
    id: string;
    id_cabang: string;
    item: string;
    satuan: string;
    stok_saat_ini: number;
    safety_threshold: number;
    max_capacity: number;
    _count: InventoryItemCountAggregateOutputType | null;
    _avg: InventoryItemAvgAggregateOutputType | null;
    _sum: InventoryItemSumAggregateOutputType | null;
    _min: InventoryItemMinAggregateOutputType | null;
    _max: InventoryItemMaxAggregateOutputType | null;
};
export type GetInventoryItemGroupByPayload<T extends InventoryItemGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<InventoryItemGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof InventoryItemGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], InventoryItemGroupByOutputType[P]> : Prisma.GetScalarType<T[P], InventoryItemGroupByOutputType[P]>;
}>>;
export type InventoryItemWhereInput = {
    AND?: Prisma.InventoryItemWhereInput | Prisma.InventoryItemWhereInput[];
    OR?: Prisma.InventoryItemWhereInput[];
    NOT?: Prisma.InventoryItemWhereInput | Prisma.InventoryItemWhereInput[];
    id?: Prisma.StringFilter<"InventoryItem"> | string;
    id_cabang?: Prisma.StringFilter<"InventoryItem"> | string;
    item?: Prisma.StringFilter<"InventoryItem"> | string;
    satuan?: Prisma.StringFilter<"InventoryItem"> | string;
    stok_saat_ini?: Prisma.IntFilter<"InventoryItem"> | number;
    safety_threshold?: Prisma.IntFilter<"InventoryItem"> | number;
    max_capacity?: Prisma.IntFilter<"InventoryItem"> | number;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
};
export type InventoryItemOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    item?: Prisma.SortOrder;
    satuan?: Prisma.SortOrder;
    stok_saat_ini?: Prisma.SortOrder;
    safety_threshold?: Prisma.SortOrder;
    max_capacity?: Prisma.SortOrder;
    branch?: Prisma.BranchOrderByWithRelationInput;
};
export type InventoryItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    id_cabang_item?: Prisma.InventoryItemId_cabangItemCompoundUniqueInput;
    AND?: Prisma.InventoryItemWhereInput | Prisma.InventoryItemWhereInput[];
    OR?: Prisma.InventoryItemWhereInput[];
    NOT?: Prisma.InventoryItemWhereInput | Prisma.InventoryItemWhereInput[];
    id_cabang?: Prisma.StringFilter<"InventoryItem"> | string;
    item?: Prisma.StringFilter<"InventoryItem"> | string;
    satuan?: Prisma.StringFilter<"InventoryItem"> | string;
    stok_saat_ini?: Prisma.IntFilter<"InventoryItem"> | number;
    safety_threshold?: Prisma.IntFilter<"InventoryItem"> | number;
    max_capacity?: Prisma.IntFilter<"InventoryItem"> | number;
    branch?: Prisma.XOR<Prisma.BranchScalarRelationFilter, Prisma.BranchWhereInput>;
}, "id" | "id_cabang_item">;
export type InventoryItemOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    item?: Prisma.SortOrder;
    satuan?: Prisma.SortOrder;
    stok_saat_ini?: Prisma.SortOrder;
    safety_threshold?: Prisma.SortOrder;
    max_capacity?: Prisma.SortOrder;
    _count?: Prisma.InventoryItemCountOrderByAggregateInput;
    _avg?: Prisma.InventoryItemAvgOrderByAggregateInput;
    _max?: Prisma.InventoryItemMaxOrderByAggregateInput;
    _min?: Prisma.InventoryItemMinOrderByAggregateInput;
    _sum?: Prisma.InventoryItemSumOrderByAggregateInput;
};
export type InventoryItemScalarWhereWithAggregatesInput = {
    AND?: Prisma.InventoryItemScalarWhereWithAggregatesInput | Prisma.InventoryItemScalarWhereWithAggregatesInput[];
    OR?: Prisma.InventoryItemScalarWhereWithAggregatesInput[];
    NOT?: Prisma.InventoryItemScalarWhereWithAggregatesInput | Prisma.InventoryItemScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"InventoryItem"> | string;
    id_cabang?: Prisma.StringWithAggregatesFilter<"InventoryItem"> | string;
    item?: Prisma.StringWithAggregatesFilter<"InventoryItem"> | string;
    satuan?: Prisma.StringWithAggregatesFilter<"InventoryItem"> | string;
    stok_saat_ini?: Prisma.IntWithAggregatesFilter<"InventoryItem"> | number;
    safety_threshold?: Prisma.IntWithAggregatesFilter<"InventoryItem"> | number;
    max_capacity?: Prisma.IntWithAggregatesFilter<"InventoryItem"> | number;
};
export type InventoryItemCreateInput = {
    id?: string;
    item: string;
    satuan: string;
    stok_saat_ini: number;
    safety_threshold: number;
    max_capacity: number;
    branch: Prisma.BranchCreateNestedOneWithoutInventory_itemsInput;
};
export type InventoryItemUncheckedCreateInput = {
    id?: string;
    id_cabang: string;
    item: string;
    satuan: string;
    stok_saat_ini: number;
    safety_threshold: number;
    max_capacity: number;
};
export type InventoryItemUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    satuan?: Prisma.StringFieldUpdateOperationsInput | string;
    stok_saat_ini?: Prisma.IntFieldUpdateOperationsInput | number;
    safety_threshold?: Prisma.IntFieldUpdateOperationsInput | number;
    max_capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    branch?: Prisma.BranchUpdateOneRequiredWithoutInventory_itemsNestedInput;
};
export type InventoryItemUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    satuan?: Prisma.StringFieldUpdateOperationsInput | string;
    stok_saat_ini?: Prisma.IntFieldUpdateOperationsInput | number;
    safety_threshold?: Prisma.IntFieldUpdateOperationsInput | number;
    max_capacity?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type InventoryItemCreateManyInput = {
    id?: string;
    id_cabang: string;
    item: string;
    satuan: string;
    stok_saat_ini: number;
    safety_threshold: number;
    max_capacity: number;
};
export type InventoryItemUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    satuan?: Prisma.StringFieldUpdateOperationsInput | string;
    stok_saat_ini?: Prisma.IntFieldUpdateOperationsInput | number;
    safety_threshold?: Prisma.IntFieldUpdateOperationsInput | number;
    max_capacity?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type InventoryItemUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    satuan?: Prisma.StringFieldUpdateOperationsInput | string;
    stok_saat_ini?: Prisma.IntFieldUpdateOperationsInput | number;
    safety_threshold?: Prisma.IntFieldUpdateOperationsInput | number;
    max_capacity?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type InventoryItemListRelationFilter = {
    every?: Prisma.InventoryItemWhereInput;
    some?: Prisma.InventoryItemWhereInput;
    none?: Prisma.InventoryItemWhereInput;
};
export type InventoryItemOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type InventoryItemId_cabangItemCompoundUniqueInput = {
    id_cabang: string;
    item: string;
};
export type InventoryItemCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    item?: Prisma.SortOrder;
    satuan?: Prisma.SortOrder;
    stok_saat_ini?: Prisma.SortOrder;
    safety_threshold?: Prisma.SortOrder;
    max_capacity?: Prisma.SortOrder;
};
export type InventoryItemAvgOrderByAggregateInput = {
    stok_saat_ini?: Prisma.SortOrder;
    safety_threshold?: Prisma.SortOrder;
    max_capacity?: Prisma.SortOrder;
};
export type InventoryItemMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    item?: Prisma.SortOrder;
    satuan?: Prisma.SortOrder;
    stok_saat_ini?: Prisma.SortOrder;
    safety_threshold?: Prisma.SortOrder;
    max_capacity?: Prisma.SortOrder;
};
export type InventoryItemMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    item?: Prisma.SortOrder;
    satuan?: Prisma.SortOrder;
    stok_saat_ini?: Prisma.SortOrder;
    safety_threshold?: Prisma.SortOrder;
    max_capacity?: Prisma.SortOrder;
};
export type InventoryItemSumOrderByAggregateInput = {
    stok_saat_ini?: Prisma.SortOrder;
    safety_threshold?: Prisma.SortOrder;
    max_capacity?: Prisma.SortOrder;
};
export type InventoryItemCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.InventoryItemCreateWithoutBranchInput, Prisma.InventoryItemUncheckedCreateWithoutBranchInput> | Prisma.InventoryItemCreateWithoutBranchInput[] | Prisma.InventoryItemUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.InventoryItemCreateOrConnectWithoutBranchInput | Prisma.InventoryItemCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.InventoryItemCreateManyBranchInputEnvelope;
    connect?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
};
export type InventoryItemUncheckedCreateNestedManyWithoutBranchInput = {
    create?: Prisma.XOR<Prisma.InventoryItemCreateWithoutBranchInput, Prisma.InventoryItemUncheckedCreateWithoutBranchInput> | Prisma.InventoryItemCreateWithoutBranchInput[] | Prisma.InventoryItemUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.InventoryItemCreateOrConnectWithoutBranchInput | Prisma.InventoryItemCreateOrConnectWithoutBranchInput[];
    createMany?: Prisma.InventoryItemCreateManyBranchInputEnvelope;
    connect?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
};
export type InventoryItemUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.InventoryItemCreateWithoutBranchInput, Prisma.InventoryItemUncheckedCreateWithoutBranchInput> | Prisma.InventoryItemCreateWithoutBranchInput[] | Prisma.InventoryItemUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.InventoryItemCreateOrConnectWithoutBranchInput | Prisma.InventoryItemCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.InventoryItemUpsertWithWhereUniqueWithoutBranchInput | Prisma.InventoryItemUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.InventoryItemCreateManyBranchInputEnvelope;
    set?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    disconnect?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    delete?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    connect?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    update?: Prisma.InventoryItemUpdateWithWhereUniqueWithoutBranchInput | Prisma.InventoryItemUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.InventoryItemUpdateManyWithWhereWithoutBranchInput | Prisma.InventoryItemUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.InventoryItemScalarWhereInput | Prisma.InventoryItemScalarWhereInput[];
};
export type InventoryItemUncheckedUpdateManyWithoutBranchNestedInput = {
    create?: Prisma.XOR<Prisma.InventoryItemCreateWithoutBranchInput, Prisma.InventoryItemUncheckedCreateWithoutBranchInput> | Prisma.InventoryItemCreateWithoutBranchInput[] | Prisma.InventoryItemUncheckedCreateWithoutBranchInput[];
    connectOrCreate?: Prisma.InventoryItemCreateOrConnectWithoutBranchInput | Prisma.InventoryItemCreateOrConnectWithoutBranchInput[];
    upsert?: Prisma.InventoryItemUpsertWithWhereUniqueWithoutBranchInput | Prisma.InventoryItemUpsertWithWhereUniqueWithoutBranchInput[];
    createMany?: Prisma.InventoryItemCreateManyBranchInputEnvelope;
    set?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    disconnect?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    delete?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    connect?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    update?: Prisma.InventoryItemUpdateWithWhereUniqueWithoutBranchInput | Prisma.InventoryItemUpdateWithWhereUniqueWithoutBranchInput[];
    updateMany?: Prisma.InventoryItemUpdateManyWithWhereWithoutBranchInput | Prisma.InventoryItemUpdateManyWithWhereWithoutBranchInput[];
    deleteMany?: Prisma.InventoryItemScalarWhereInput | Prisma.InventoryItemScalarWhereInput[];
};
export type InventoryItemCreateWithoutBranchInput = {
    id?: string;
    item: string;
    satuan: string;
    stok_saat_ini: number;
    safety_threshold: number;
    max_capacity: number;
};
export type InventoryItemUncheckedCreateWithoutBranchInput = {
    id?: string;
    item: string;
    satuan: string;
    stok_saat_ini: number;
    safety_threshold: number;
    max_capacity: number;
};
export type InventoryItemCreateOrConnectWithoutBranchInput = {
    where: Prisma.InventoryItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.InventoryItemCreateWithoutBranchInput, Prisma.InventoryItemUncheckedCreateWithoutBranchInput>;
};
export type InventoryItemCreateManyBranchInputEnvelope = {
    data: Prisma.InventoryItemCreateManyBranchInput | Prisma.InventoryItemCreateManyBranchInput[];
    skipDuplicates?: boolean;
};
export type InventoryItemUpsertWithWhereUniqueWithoutBranchInput = {
    where: Prisma.InventoryItemWhereUniqueInput;
    update: Prisma.XOR<Prisma.InventoryItemUpdateWithoutBranchInput, Prisma.InventoryItemUncheckedUpdateWithoutBranchInput>;
    create: Prisma.XOR<Prisma.InventoryItemCreateWithoutBranchInput, Prisma.InventoryItemUncheckedCreateWithoutBranchInput>;
};
export type InventoryItemUpdateWithWhereUniqueWithoutBranchInput = {
    where: Prisma.InventoryItemWhereUniqueInput;
    data: Prisma.XOR<Prisma.InventoryItemUpdateWithoutBranchInput, Prisma.InventoryItemUncheckedUpdateWithoutBranchInput>;
};
export type InventoryItemUpdateManyWithWhereWithoutBranchInput = {
    where: Prisma.InventoryItemScalarWhereInput;
    data: Prisma.XOR<Prisma.InventoryItemUpdateManyMutationInput, Prisma.InventoryItemUncheckedUpdateManyWithoutBranchInput>;
};
export type InventoryItemScalarWhereInput = {
    AND?: Prisma.InventoryItemScalarWhereInput | Prisma.InventoryItemScalarWhereInput[];
    OR?: Prisma.InventoryItemScalarWhereInput[];
    NOT?: Prisma.InventoryItemScalarWhereInput | Prisma.InventoryItemScalarWhereInput[];
    id?: Prisma.StringFilter<"InventoryItem"> | string;
    id_cabang?: Prisma.StringFilter<"InventoryItem"> | string;
    item?: Prisma.StringFilter<"InventoryItem"> | string;
    satuan?: Prisma.StringFilter<"InventoryItem"> | string;
    stok_saat_ini?: Prisma.IntFilter<"InventoryItem"> | number;
    safety_threshold?: Prisma.IntFilter<"InventoryItem"> | number;
    max_capacity?: Prisma.IntFilter<"InventoryItem"> | number;
};
export type InventoryItemCreateManyBranchInput = {
    id?: string;
    item: string;
    satuan: string;
    stok_saat_ini: number;
    safety_threshold: number;
    max_capacity: number;
};
export type InventoryItemUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    satuan?: Prisma.StringFieldUpdateOperationsInput | string;
    stok_saat_ini?: Prisma.IntFieldUpdateOperationsInput | number;
    safety_threshold?: Prisma.IntFieldUpdateOperationsInput | number;
    max_capacity?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type InventoryItemUncheckedUpdateWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    satuan?: Prisma.StringFieldUpdateOperationsInput | string;
    stok_saat_ini?: Prisma.IntFieldUpdateOperationsInput | number;
    safety_threshold?: Prisma.IntFieldUpdateOperationsInput | number;
    max_capacity?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type InventoryItemUncheckedUpdateManyWithoutBranchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    satuan?: Prisma.StringFieldUpdateOperationsInput | string;
    stok_saat_ini?: Prisma.IntFieldUpdateOperationsInput | number;
    safety_threshold?: Prisma.IntFieldUpdateOperationsInput | number;
    max_capacity?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type InventoryItemSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    id_cabang?: boolean;
    item?: boolean;
    satuan?: boolean;
    stok_saat_ini?: boolean;
    safety_threshold?: boolean;
    max_capacity?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["inventoryItem"]>;
export type InventoryItemSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    id_cabang?: boolean;
    item?: boolean;
    satuan?: boolean;
    stok_saat_ini?: boolean;
    safety_threshold?: boolean;
    max_capacity?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["inventoryItem"]>;
export type InventoryItemSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    id_cabang?: boolean;
    item?: boolean;
    satuan?: boolean;
    stok_saat_ini?: boolean;
    safety_threshold?: boolean;
    max_capacity?: boolean;
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["inventoryItem"]>;
export type InventoryItemSelectScalar = {
    id?: boolean;
    id_cabang?: boolean;
    item?: boolean;
    satuan?: boolean;
    stok_saat_ini?: boolean;
    safety_threshold?: boolean;
    max_capacity?: boolean;
};
export type InventoryItemOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "id_cabang" | "item" | "satuan" | "stok_saat_ini" | "safety_threshold" | "max_capacity", ExtArgs["result"]["inventoryItem"]>;
export type InventoryItemInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type InventoryItemIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type InventoryItemIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    branch?: boolean | Prisma.BranchDefaultArgs<ExtArgs>;
};
export type $InventoryItemPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "InventoryItem";
    objects: {
        branch: Prisma.$BranchPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        id_cabang: string;
        item: string;
        satuan: string;
        stok_saat_ini: number;
        safety_threshold: number;
        max_capacity: number;
    }, ExtArgs["result"]["inventoryItem"]>;
    composites: {};
};
export type InventoryItemGetPayload<S extends boolean | null | undefined | InventoryItemDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload, S>;
export type InventoryItemCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<InventoryItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: InventoryItemCountAggregateInputType | true;
};
export interface InventoryItemDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['InventoryItem'];
        meta: {
            name: 'InventoryItem';
        };
    };
    /**
     * Find zero or one InventoryItem that matches the filter.
     * @param {InventoryItemFindUniqueArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryItemFindUniqueArgs>(args: Prisma.SelectSubset<T, InventoryItemFindUniqueArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one InventoryItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventoryItemFindUniqueOrThrowArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryItemFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, InventoryItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first InventoryItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemFindFirstArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryItemFindFirstArgs>(args?: Prisma.SelectSubset<T, InventoryItemFindFirstArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first InventoryItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemFindFirstOrThrowArgs} args - Arguments to find a InventoryItem
     * @example
     * // Get one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryItemFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, InventoryItemFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more InventoryItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryItems
     * const inventoryItems = await prisma.inventoryItem.findMany()
     *
     * // Get first 10 InventoryItems
     * const inventoryItems = await prisma.inventoryItem.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const inventoryItemWithIdOnly = await prisma.inventoryItem.findMany({ select: { id: true } })
     *
     */
    findMany<T extends InventoryItemFindManyArgs>(args?: Prisma.SelectSubset<T, InventoryItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a InventoryItem.
     * @param {InventoryItemCreateArgs} args - Arguments to create a InventoryItem.
     * @example
     * // Create one InventoryItem
     * const InventoryItem = await prisma.inventoryItem.create({
     *   data: {
     *     // ... data to create a InventoryItem
     *   }
     * })
     *
     */
    create<T extends InventoryItemCreateArgs>(args: Prisma.SelectSubset<T, InventoryItemCreateArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many InventoryItems.
     * @param {InventoryItemCreateManyArgs} args - Arguments to create many InventoryItems.
     * @example
     * // Create many InventoryItems
     * const inventoryItem = await prisma.inventoryItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends InventoryItemCreateManyArgs>(args?: Prisma.SelectSubset<T, InventoryItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many InventoryItems and returns the data saved in the database.
     * @param {InventoryItemCreateManyAndReturnArgs} args - Arguments to create many InventoryItems.
     * @example
     * // Create many InventoryItems
     * const inventoryItem = await prisma.inventoryItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many InventoryItems and only return the `id`
     * const inventoryItemWithIdOnly = await prisma.inventoryItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends InventoryItemCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, InventoryItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a InventoryItem.
     * @param {InventoryItemDeleteArgs} args - Arguments to delete one InventoryItem.
     * @example
     * // Delete one InventoryItem
     * const InventoryItem = await prisma.inventoryItem.delete({
     *   where: {
     *     // ... filter to delete one InventoryItem
     *   }
     * })
     *
     */
    delete<T extends InventoryItemDeleteArgs>(args: Prisma.SelectSubset<T, InventoryItemDeleteArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one InventoryItem.
     * @param {InventoryItemUpdateArgs} args - Arguments to update one InventoryItem.
     * @example
     * // Update one InventoryItem
     * const inventoryItem = await prisma.inventoryItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends InventoryItemUpdateArgs>(args: Prisma.SelectSubset<T, InventoryItemUpdateArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more InventoryItems.
     * @param {InventoryItemDeleteManyArgs} args - Arguments to filter InventoryItems to delete.
     * @example
     * // Delete a few InventoryItems
     * const { count } = await prisma.inventoryItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends InventoryItemDeleteManyArgs>(args?: Prisma.SelectSubset<T, InventoryItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more InventoryItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryItems
     * const inventoryItem = await prisma.inventoryItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends InventoryItemUpdateManyArgs>(args: Prisma.SelectSubset<T, InventoryItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more InventoryItems and returns the data updated in the database.
     * @param {InventoryItemUpdateManyAndReturnArgs} args - Arguments to update many InventoryItems.
     * @example
     * // Update many InventoryItems
     * const inventoryItem = await prisma.inventoryItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more InventoryItems and only return the `id`
     * const inventoryItemWithIdOnly = await prisma.inventoryItem.updateManyAndReturn({
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
    updateManyAndReturn<T extends InventoryItemUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, InventoryItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one InventoryItem.
     * @param {InventoryItemUpsertArgs} args - Arguments to update or create a InventoryItem.
     * @example
     * // Update or create a InventoryItem
     * const inventoryItem = await prisma.inventoryItem.upsert({
     *   create: {
     *     // ... data to create a InventoryItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryItem we want to update
     *   }
     * })
     */
    upsert<T extends InventoryItemUpsertArgs>(args: Prisma.SelectSubset<T, InventoryItemUpsertArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of InventoryItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemCountArgs} args - Arguments to filter InventoryItems to count.
     * @example
     * // Count the number of InventoryItems
     * const count = await prisma.inventoryItem.count({
     *   where: {
     *     // ... the filter for the InventoryItems we want to count
     *   }
     * })
    **/
    count<T extends InventoryItemCountArgs>(args?: Prisma.Subset<T, InventoryItemCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], InventoryItemCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a InventoryItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InventoryItemAggregateArgs>(args: Prisma.Subset<T, InventoryItemAggregateArgs>): Prisma.PrismaPromise<GetInventoryItemAggregateType<T>>;
    /**
     * Group by InventoryItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryItemGroupByArgs} args - Group by arguments.
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
    groupBy<T extends InventoryItemGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: InventoryItemGroupByArgs['orderBy'];
    } : {
        orderBy?: InventoryItemGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, InventoryItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the InventoryItem model
     */
    readonly fields: InventoryItemFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for InventoryItem.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__InventoryItemClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
 * Fields of the InventoryItem model
 */
export interface InventoryItemFieldRefs {
    readonly id: Prisma.FieldRef<"InventoryItem", 'String'>;
    readonly id_cabang: Prisma.FieldRef<"InventoryItem", 'String'>;
    readonly item: Prisma.FieldRef<"InventoryItem", 'String'>;
    readonly satuan: Prisma.FieldRef<"InventoryItem", 'String'>;
    readonly stok_saat_ini: Prisma.FieldRef<"InventoryItem", 'Int'>;
    readonly safety_threshold: Prisma.FieldRef<"InventoryItem", 'Int'>;
    readonly max_capacity: Prisma.FieldRef<"InventoryItem", 'Int'>;
}
/**
 * InventoryItem findUnique
 */
export type InventoryItemFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which InventoryItem to fetch.
     */
    where: Prisma.InventoryItemWhereUniqueInput;
};
/**
 * InventoryItem findUniqueOrThrow
 */
export type InventoryItemFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which InventoryItem to fetch.
     */
    where: Prisma.InventoryItemWhereUniqueInput;
};
/**
 * InventoryItem findFirst
 */
export type InventoryItemFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which InventoryItem to fetch.
     */
    where?: Prisma.InventoryItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: Prisma.InventoryItemOrderByWithRelationInput | Prisma.InventoryItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for InventoryItems.
     */
    cursor?: Prisma.InventoryItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InventoryItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of InventoryItems.
     */
    distinct?: Prisma.InventoryItemScalarFieldEnum | Prisma.InventoryItemScalarFieldEnum[];
};
/**
 * InventoryItem findFirstOrThrow
 */
export type InventoryItemFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which InventoryItem to fetch.
     */
    where?: Prisma.InventoryItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: Prisma.InventoryItemOrderByWithRelationInput | Prisma.InventoryItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for InventoryItems.
     */
    cursor?: Prisma.InventoryItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InventoryItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of InventoryItems.
     */
    distinct?: Prisma.InventoryItemScalarFieldEnum | Prisma.InventoryItemScalarFieldEnum[];
};
/**
 * InventoryItem findMany
 */
export type InventoryItemFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which InventoryItems to fetch.
     */
    where?: Prisma.InventoryItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InventoryItems to fetch.
     */
    orderBy?: Prisma.InventoryItemOrderByWithRelationInput | Prisma.InventoryItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing InventoryItems.
     */
    cursor?: Prisma.InventoryItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InventoryItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InventoryItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of InventoryItems.
     */
    distinct?: Prisma.InventoryItemScalarFieldEnum | Prisma.InventoryItemScalarFieldEnum[];
};
/**
 * InventoryItem create
 */
export type InventoryItemCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a InventoryItem.
     */
    data: Prisma.XOR<Prisma.InventoryItemCreateInput, Prisma.InventoryItemUncheckedCreateInput>;
};
/**
 * InventoryItem createMany
 */
export type InventoryItemCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryItems.
     */
    data: Prisma.InventoryItemCreateManyInput | Prisma.InventoryItemCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * InventoryItem createManyAndReturn
 */
export type InventoryItemCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: Prisma.InventoryItemSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: Prisma.InventoryItemOmit<ExtArgs> | null;
    /**
     * The data used to create many InventoryItems.
     */
    data: Prisma.InventoryItemCreateManyInput | Prisma.InventoryItemCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InventoryItemIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * InventoryItem update
 */
export type InventoryItemUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a InventoryItem.
     */
    data: Prisma.XOR<Prisma.InventoryItemUpdateInput, Prisma.InventoryItemUncheckedUpdateInput>;
    /**
     * Choose, which InventoryItem to update.
     */
    where: Prisma.InventoryItemWhereUniqueInput;
};
/**
 * InventoryItem updateMany
 */
export type InventoryItemUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryItems.
     */
    data: Prisma.XOR<Prisma.InventoryItemUpdateManyMutationInput, Prisma.InventoryItemUncheckedUpdateManyInput>;
    /**
     * Filter which InventoryItems to update
     */
    where?: Prisma.InventoryItemWhereInput;
    /**
     * Limit how many InventoryItems to update.
     */
    limit?: number;
};
/**
 * InventoryItem updateManyAndReturn
 */
export type InventoryItemUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryItem
     */
    select?: Prisma.InventoryItemSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the InventoryItem
     */
    omit?: Prisma.InventoryItemOmit<ExtArgs> | null;
    /**
     * The data used to update InventoryItems.
     */
    data: Prisma.XOR<Prisma.InventoryItemUpdateManyMutationInput, Prisma.InventoryItemUncheckedUpdateManyInput>;
    /**
     * Filter which InventoryItems to update
     */
    where?: Prisma.InventoryItemWhereInput;
    /**
     * Limit how many InventoryItems to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InventoryItemIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * InventoryItem upsert
 */
export type InventoryItemUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the InventoryItem to update in case it exists.
     */
    where: Prisma.InventoryItemWhereUniqueInput;
    /**
     * In case the InventoryItem found by the `where` argument doesn't exist, create a new InventoryItem with this data.
     */
    create: Prisma.XOR<Prisma.InventoryItemCreateInput, Prisma.InventoryItemUncheckedCreateInput>;
    /**
     * In case the InventoryItem was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.InventoryItemUpdateInput, Prisma.InventoryItemUncheckedUpdateInput>;
};
/**
 * InventoryItem delete
 */
export type InventoryItemDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which InventoryItem to delete.
     */
    where: Prisma.InventoryItemWhereUniqueInput;
};
/**
 * InventoryItem deleteMany
 */
export type InventoryItemDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryItems to delete
     */
    where?: Prisma.InventoryItemWhereInput;
    /**
     * Limit how many InventoryItems to delete.
     */
    limit?: number;
};
/**
 * InventoryItem without action
 */
export type InventoryItemDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
//# sourceMappingURL=InventoryItem.d.ts.map