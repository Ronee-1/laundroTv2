import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model InventoryAnomaly
 *
 */
export type InventoryAnomalyModel = runtime.Types.Result.DefaultSelection<Prisma.$InventoryAnomalyPayload>;
export type AggregateInventoryAnomaly = {
    _count: InventoryAnomalyCountAggregateOutputType | null;
    _avg: InventoryAnomalyAvgAggregateOutputType | null;
    _sum: InventoryAnomalySumAggregateOutputType | null;
    _min: InventoryAnomalyMinAggregateOutputType | null;
    _max: InventoryAnomalyMaxAggregateOutputType | null;
};
export type InventoryAnomalyAvgAggregateOutputType = {
    stok_lama: number | null;
    stok_baru: number | null;
};
export type InventoryAnomalySumAggregateOutputType = {
    stok_lama: number | null;
    stok_baru: number | null;
};
export type InventoryAnomalyMinAggregateOutputType = {
    id: string | null;
    id_cabang: string | null;
    nama_cabang: string | null;
    item: string | null;
    stok_lama: number | null;
    stok_baru: number | null;
    alasan: string | null;
    timestamp: Date | null;
};
export type InventoryAnomalyMaxAggregateOutputType = {
    id: string | null;
    id_cabang: string | null;
    nama_cabang: string | null;
    item: string | null;
    stok_lama: number | null;
    stok_baru: number | null;
    alasan: string | null;
    timestamp: Date | null;
};
export type InventoryAnomalyCountAggregateOutputType = {
    id: number;
    id_cabang: number;
    nama_cabang: number;
    item: number;
    stok_lama: number;
    stok_baru: number;
    alasan: number;
    timestamp: number;
    _all: number;
};
export type InventoryAnomalyAvgAggregateInputType = {
    stok_lama?: true;
    stok_baru?: true;
};
export type InventoryAnomalySumAggregateInputType = {
    stok_lama?: true;
    stok_baru?: true;
};
export type InventoryAnomalyMinAggregateInputType = {
    id?: true;
    id_cabang?: true;
    nama_cabang?: true;
    item?: true;
    stok_lama?: true;
    stok_baru?: true;
    alasan?: true;
    timestamp?: true;
};
export type InventoryAnomalyMaxAggregateInputType = {
    id?: true;
    id_cabang?: true;
    nama_cabang?: true;
    item?: true;
    stok_lama?: true;
    stok_baru?: true;
    alasan?: true;
    timestamp?: true;
};
export type InventoryAnomalyCountAggregateInputType = {
    id?: true;
    id_cabang?: true;
    nama_cabang?: true;
    item?: true;
    stok_lama?: true;
    stok_baru?: true;
    alasan?: true;
    timestamp?: true;
    _all?: true;
};
export type InventoryAnomalyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryAnomaly to aggregate.
     */
    where?: Prisma.InventoryAnomalyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InventoryAnomalies to fetch.
     */
    orderBy?: Prisma.InventoryAnomalyOrderByWithRelationInput | Prisma.InventoryAnomalyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.InventoryAnomalyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InventoryAnomalies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InventoryAnomalies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned InventoryAnomalies
    **/
    _count?: true | InventoryAnomalyCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: InventoryAnomalyAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: InventoryAnomalySumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: InventoryAnomalyMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: InventoryAnomalyMaxAggregateInputType;
};
export type GetInventoryAnomalyAggregateType<T extends InventoryAnomalyAggregateArgs> = {
    [P in keyof T & keyof AggregateInventoryAnomaly]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateInventoryAnomaly[P]> : Prisma.GetScalarType<T[P], AggregateInventoryAnomaly[P]>;
};
export type InventoryAnomalyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryAnomalyWhereInput;
    orderBy?: Prisma.InventoryAnomalyOrderByWithAggregationInput | Prisma.InventoryAnomalyOrderByWithAggregationInput[];
    by: Prisma.InventoryAnomalyScalarFieldEnum[] | Prisma.InventoryAnomalyScalarFieldEnum;
    having?: Prisma.InventoryAnomalyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: InventoryAnomalyCountAggregateInputType | true;
    _avg?: InventoryAnomalyAvgAggregateInputType;
    _sum?: InventoryAnomalySumAggregateInputType;
    _min?: InventoryAnomalyMinAggregateInputType;
    _max?: InventoryAnomalyMaxAggregateInputType;
};
export type InventoryAnomalyGroupByOutputType = {
    id: string;
    id_cabang: string;
    nama_cabang: string;
    item: string;
    stok_lama: number;
    stok_baru: number;
    alasan: string;
    timestamp: Date;
    _count: InventoryAnomalyCountAggregateOutputType | null;
    _avg: InventoryAnomalyAvgAggregateOutputType | null;
    _sum: InventoryAnomalySumAggregateOutputType | null;
    _min: InventoryAnomalyMinAggregateOutputType | null;
    _max: InventoryAnomalyMaxAggregateOutputType | null;
};
export type GetInventoryAnomalyGroupByPayload<T extends InventoryAnomalyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<InventoryAnomalyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof InventoryAnomalyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], InventoryAnomalyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], InventoryAnomalyGroupByOutputType[P]>;
}>>;
export type InventoryAnomalyWhereInput = {
    AND?: Prisma.InventoryAnomalyWhereInput | Prisma.InventoryAnomalyWhereInput[];
    OR?: Prisma.InventoryAnomalyWhereInput[];
    NOT?: Prisma.InventoryAnomalyWhereInput | Prisma.InventoryAnomalyWhereInput[];
    id?: Prisma.StringFilter<"InventoryAnomaly"> | string;
    id_cabang?: Prisma.StringFilter<"InventoryAnomaly"> | string;
    nama_cabang?: Prisma.StringFilter<"InventoryAnomaly"> | string;
    item?: Prisma.StringFilter<"InventoryAnomaly"> | string;
    stok_lama?: Prisma.IntFilter<"InventoryAnomaly"> | number;
    stok_baru?: Prisma.IntFilter<"InventoryAnomaly"> | number;
    alasan?: Prisma.StringFilter<"InventoryAnomaly"> | string;
    timestamp?: Prisma.DateTimeFilter<"InventoryAnomaly"> | Date | string;
};
export type InventoryAnomalyOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    nama_cabang?: Prisma.SortOrder;
    item?: Prisma.SortOrder;
    stok_lama?: Prisma.SortOrder;
    stok_baru?: Prisma.SortOrder;
    alasan?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type InventoryAnomalyWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.InventoryAnomalyWhereInput | Prisma.InventoryAnomalyWhereInput[];
    OR?: Prisma.InventoryAnomalyWhereInput[];
    NOT?: Prisma.InventoryAnomalyWhereInput | Prisma.InventoryAnomalyWhereInput[];
    id_cabang?: Prisma.StringFilter<"InventoryAnomaly"> | string;
    nama_cabang?: Prisma.StringFilter<"InventoryAnomaly"> | string;
    item?: Prisma.StringFilter<"InventoryAnomaly"> | string;
    stok_lama?: Prisma.IntFilter<"InventoryAnomaly"> | number;
    stok_baru?: Prisma.IntFilter<"InventoryAnomaly"> | number;
    alasan?: Prisma.StringFilter<"InventoryAnomaly"> | string;
    timestamp?: Prisma.DateTimeFilter<"InventoryAnomaly"> | Date | string;
}, "id">;
export type InventoryAnomalyOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    nama_cabang?: Prisma.SortOrder;
    item?: Prisma.SortOrder;
    stok_lama?: Prisma.SortOrder;
    stok_baru?: Prisma.SortOrder;
    alasan?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
    _count?: Prisma.InventoryAnomalyCountOrderByAggregateInput;
    _avg?: Prisma.InventoryAnomalyAvgOrderByAggregateInput;
    _max?: Prisma.InventoryAnomalyMaxOrderByAggregateInput;
    _min?: Prisma.InventoryAnomalyMinOrderByAggregateInput;
    _sum?: Prisma.InventoryAnomalySumOrderByAggregateInput;
};
export type InventoryAnomalyScalarWhereWithAggregatesInput = {
    AND?: Prisma.InventoryAnomalyScalarWhereWithAggregatesInput | Prisma.InventoryAnomalyScalarWhereWithAggregatesInput[];
    OR?: Prisma.InventoryAnomalyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.InventoryAnomalyScalarWhereWithAggregatesInput | Prisma.InventoryAnomalyScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"InventoryAnomaly"> | string;
    id_cabang?: Prisma.StringWithAggregatesFilter<"InventoryAnomaly"> | string;
    nama_cabang?: Prisma.StringWithAggregatesFilter<"InventoryAnomaly"> | string;
    item?: Prisma.StringWithAggregatesFilter<"InventoryAnomaly"> | string;
    stok_lama?: Prisma.IntWithAggregatesFilter<"InventoryAnomaly"> | number;
    stok_baru?: Prisma.IntWithAggregatesFilter<"InventoryAnomaly"> | number;
    alasan?: Prisma.StringWithAggregatesFilter<"InventoryAnomaly"> | string;
    timestamp?: Prisma.DateTimeWithAggregatesFilter<"InventoryAnomaly"> | Date | string;
};
export type InventoryAnomalyCreateInput = {
    id?: string;
    id_cabang: string;
    nama_cabang: string;
    item: string;
    stok_lama: number;
    stok_baru: number;
    alasan: string;
    timestamp?: Date | string;
};
export type InventoryAnomalyUncheckedCreateInput = {
    id?: string;
    id_cabang: string;
    nama_cabang: string;
    item: string;
    stok_lama: number;
    stok_baru: number;
    alasan: string;
    timestamp?: Date | string;
};
export type InventoryAnomalyUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    stok_lama?: Prisma.IntFieldUpdateOperationsInput | number;
    stok_baru?: Prisma.IntFieldUpdateOperationsInput | number;
    alasan?: Prisma.StringFieldUpdateOperationsInput | string;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InventoryAnomalyUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    stok_lama?: Prisma.IntFieldUpdateOperationsInput | number;
    stok_baru?: Prisma.IntFieldUpdateOperationsInput | number;
    alasan?: Prisma.StringFieldUpdateOperationsInput | string;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InventoryAnomalyCreateManyInput = {
    id?: string;
    id_cabang: string;
    nama_cabang: string;
    item: string;
    stok_lama: number;
    stok_baru: number;
    alasan: string;
    timestamp?: Date | string;
};
export type InventoryAnomalyUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    stok_lama?: Prisma.IntFieldUpdateOperationsInput | number;
    stok_baru?: Prisma.IntFieldUpdateOperationsInput | number;
    alasan?: Prisma.StringFieldUpdateOperationsInput | string;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InventoryAnomalyUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    id_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    nama_cabang?: Prisma.StringFieldUpdateOperationsInput | string;
    item?: Prisma.StringFieldUpdateOperationsInput | string;
    stok_lama?: Prisma.IntFieldUpdateOperationsInput | number;
    stok_baru?: Prisma.IntFieldUpdateOperationsInput | number;
    alasan?: Prisma.StringFieldUpdateOperationsInput | string;
    timestamp?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InventoryAnomalyCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    nama_cabang?: Prisma.SortOrder;
    item?: Prisma.SortOrder;
    stok_lama?: Prisma.SortOrder;
    stok_baru?: Prisma.SortOrder;
    alasan?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type InventoryAnomalyAvgOrderByAggregateInput = {
    stok_lama?: Prisma.SortOrder;
    stok_baru?: Prisma.SortOrder;
};
export type InventoryAnomalyMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    nama_cabang?: Prisma.SortOrder;
    item?: Prisma.SortOrder;
    stok_lama?: Prisma.SortOrder;
    stok_baru?: Prisma.SortOrder;
    alasan?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type InventoryAnomalyMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    id_cabang?: Prisma.SortOrder;
    nama_cabang?: Prisma.SortOrder;
    item?: Prisma.SortOrder;
    stok_lama?: Prisma.SortOrder;
    stok_baru?: Prisma.SortOrder;
    alasan?: Prisma.SortOrder;
    timestamp?: Prisma.SortOrder;
};
export type InventoryAnomalySumOrderByAggregateInput = {
    stok_lama?: Prisma.SortOrder;
    stok_baru?: Prisma.SortOrder;
};
export type InventoryAnomalySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    id_cabang?: boolean;
    nama_cabang?: boolean;
    item?: boolean;
    stok_lama?: boolean;
    stok_baru?: boolean;
    alasan?: boolean;
    timestamp?: boolean;
}, ExtArgs["result"]["inventoryAnomaly"]>;
export type InventoryAnomalySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    id_cabang?: boolean;
    nama_cabang?: boolean;
    item?: boolean;
    stok_lama?: boolean;
    stok_baru?: boolean;
    alasan?: boolean;
    timestamp?: boolean;
}, ExtArgs["result"]["inventoryAnomaly"]>;
export type InventoryAnomalySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    id_cabang?: boolean;
    nama_cabang?: boolean;
    item?: boolean;
    stok_lama?: boolean;
    stok_baru?: boolean;
    alasan?: boolean;
    timestamp?: boolean;
}, ExtArgs["result"]["inventoryAnomaly"]>;
export type InventoryAnomalySelectScalar = {
    id?: boolean;
    id_cabang?: boolean;
    nama_cabang?: boolean;
    item?: boolean;
    stok_lama?: boolean;
    stok_baru?: boolean;
    alasan?: boolean;
    timestamp?: boolean;
};
export type InventoryAnomalyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "id_cabang" | "nama_cabang" | "item" | "stok_lama" | "stok_baru" | "alasan" | "timestamp", ExtArgs["result"]["inventoryAnomaly"]>;
export type $InventoryAnomalyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "InventoryAnomaly";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        id_cabang: string;
        nama_cabang: string;
        item: string;
        stok_lama: number;
        stok_baru: number;
        alasan: string;
        timestamp: Date;
    }, ExtArgs["result"]["inventoryAnomaly"]>;
    composites: {};
};
export type InventoryAnomalyGetPayload<S extends boolean | null | undefined | InventoryAnomalyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$InventoryAnomalyPayload, S>;
export type InventoryAnomalyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<InventoryAnomalyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: InventoryAnomalyCountAggregateInputType | true;
};
export interface InventoryAnomalyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['InventoryAnomaly'];
        meta: {
            name: 'InventoryAnomaly';
        };
    };
    /**
     * Find zero or one InventoryAnomaly that matches the filter.
     * @param {InventoryAnomalyFindUniqueArgs} args - Arguments to find a InventoryAnomaly
     * @example
     * // Get one InventoryAnomaly
     * const inventoryAnomaly = await prisma.inventoryAnomaly.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryAnomalyFindUniqueArgs>(args: Prisma.SelectSubset<T, InventoryAnomalyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__InventoryAnomalyClient<runtime.Types.Result.GetResult<Prisma.$InventoryAnomalyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one InventoryAnomaly that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventoryAnomalyFindUniqueOrThrowArgs} args - Arguments to find a InventoryAnomaly
     * @example
     * // Get one InventoryAnomaly
     * const inventoryAnomaly = await prisma.inventoryAnomaly.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryAnomalyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, InventoryAnomalyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__InventoryAnomalyClient<runtime.Types.Result.GetResult<Prisma.$InventoryAnomalyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first InventoryAnomaly that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAnomalyFindFirstArgs} args - Arguments to find a InventoryAnomaly
     * @example
     * // Get one InventoryAnomaly
     * const inventoryAnomaly = await prisma.inventoryAnomaly.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryAnomalyFindFirstArgs>(args?: Prisma.SelectSubset<T, InventoryAnomalyFindFirstArgs<ExtArgs>>): Prisma.Prisma__InventoryAnomalyClient<runtime.Types.Result.GetResult<Prisma.$InventoryAnomalyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first InventoryAnomaly that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAnomalyFindFirstOrThrowArgs} args - Arguments to find a InventoryAnomaly
     * @example
     * // Get one InventoryAnomaly
     * const inventoryAnomaly = await prisma.inventoryAnomaly.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryAnomalyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, InventoryAnomalyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__InventoryAnomalyClient<runtime.Types.Result.GetResult<Prisma.$InventoryAnomalyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more InventoryAnomalies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAnomalyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InventoryAnomalies
     * const inventoryAnomalies = await prisma.inventoryAnomaly.findMany()
     *
     * // Get first 10 InventoryAnomalies
     * const inventoryAnomalies = await prisma.inventoryAnomaly.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const inventoryAnomalyWithIdOnly = await prisma.inventoryAnomaly.findMany({ select: { id: true } })
     *
     */
    findMany<T extends InventoryAnomalyFindManyArgs>(args?: Prisma.SelectSubset<T, InventoryAnomalyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryAnomalyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a InventoryAnomaly.
     * @param {InventoryAnomalyCreateArgs} args - Arguments to create a InventoryAnomaly.
     * @example
     * // Create one InventoryAnomaly
     * const InventoryAnomaly = await prisma.inventoryAnomaly.create({
     *   data: {
     *     // ... data to create a InventoryAnomaly
     *   }
     * })
     *
     */
    create<T extends InventoryAnomalyCreateArgs>(args: Prisma.SelectSubset<T, InventoryAnomalyCreateArgs<ExtArgs>>): Prisma.Prisma__InventoryAnomalyClient<runtime.Types.Result.GetResult<Prisma.$InventoryAnomalyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many InventoryAnomalies.
     * @param {InventoryAnomalyCreateManyArgs} args - Arguments to create many InventoryAnomalies.
     * @example
     * // Create many InventoryAnomalies
     * const inventoryAnomaly = await prisma.inventoryAnomaly.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends InventoryAnomalyCreateManyArgs>(args?: Prisma.SelectSubset<T, InventoryAnomalyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many InventoryAnomalies and returns the data saved in the database.
     * @param {InventoryAnomalyCreateManyAndReturnArgs} args - Arguments to create many InventoryAnomalies.
     * @example
     * // Create many InventoryAnomalies
     * const inventoryAnomaly = await prisma.inventoryAnomaly.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many InventoryAnomalies and only return the `id`
     * const inventoryAnomalyWithIdOnly = await prisma.inventoryAnomaly.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends InventoryAnomalyCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, InventoryAnomalyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryAnomalyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a InventoryAnomaly.
     * @param {InventoryAnomalyDeleteArgs} args - Arguments to delete one InventoryAnomaly.
     * @example
     * // Delete one InventoryAnomaly
     * const InventoryAnomaly = await prisma.inventoryAnomaly.delete({
     *   where: {
     *     // ... filter to delete one InventoryAnomaly
     *   }
     * })
     *
     */
    delete<T extends InventoryAnomalyDeleteArgs>(args: Prisma.SelectSubset<T, InventoryAnomalyDeleteArgs<ExtArgs>>): Prisma.Prisma__InventoryAnomalyClient<runtime.Types.Result.GetResult<Prisma.$InventoryAnomalyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one InventoryAnomaly.
     * @param {InventoryAnomalyUpdateArgs} args - Arguments to update one InventoryAnomaly.
     * @example
     * // Update one InventoryAnomaly
     * const inventoryAnomaly = await prisma.inventoryAnomaly.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends InventoryAnomalyUpdateArgs>(args: Prisma.SelectSubset<T, InventoryAnomalyUpdateArgs<ExtArgs>>): Prisma.Prisma__InventoryAnomalyClient<runtime.Types.Result.GetResult<Prisma.$InventoryAnomalyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more InventoryAnomalies.
     * @param {InventoryAnomalyDeleteManyArgs} args - Arguments to filter InventoryAnomalies to delete.
     * @example
     * // Delete a few InventoryAnomalies
     * const { count } = await prisma.inventoryAnomaly.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends InventoryAnomalyDeleteManyArgs>(args?: Prisma.SelectSubset<T, InventoryAnomalyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more InventoryAnomalies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAnomalyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InventoryAnomalies
     * const inventoryAnomaly = await prisma.inventoryAnomaly.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends InventoryAnomalyUpdateManyArgs>(args: Prisma.SelectSubset<T, InventoryAnomalyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more InventoryAnomalies and returns the data updated in the database.
     * @param {InventoryAnomalyUpdateManyAndReturnArgs} args - Arguments to update many InventoryAnomalies.
     * @example
     * // Update many InventoryAnomalies
     * const inventoryAnomaly = await prisma.inventoryAnomaly.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more InventoryAnomalies and only return the `id`
     * const inventoryAnomalyWithIdOnly = await prisma.inventoryAnomaly.updateManyAndReturn({
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
    updateManyAndReturn<T extends InventoryAnomalyUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, InventoryAnomalyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryAnomalyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one InventoryAnomaly.
     * @param {InventoryAnomalyUpsertArgs} args - Arguments to update or create a InventoryAnomaly.
     * @example
     * // Update or create a InventoryAnomaly
     * const inventoryAnomaly = await prisma.inventoryAnomaly.upsert({
     *   create: {
     *     // ... data to create a InventoryAnomaly
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InventoryAnomaly we want to update
     *   }
     * })
     */
    upsert<T extends InventoryAnomalyUpsertArgs>(args: Prisma.SelectSubset<T, InventoryAnomalyUpsertArgs<ExtArgs>>): Prisma.Prisma__InventoryAnomalyClient<runtime.Types.Result.GetResult<Prisma.$InventoryAnomalyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of InventoryAnomalies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAnomalyCountArgs} args - Arguments to filter InventoryAnomalies to count.
     * @example
     * // Count the number of InventoryAnomalies
     * const count = await prisma.inventoryAnomaly.count({
     *   where: {
     *     // ... the filter for the InventoryAnomalies we want to count
     *   }
     * })
    **/
    count<T extends InventoryAnomalyCountArgs>(args?: Prisma.Subset<T, InventoryAnomalyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], InventoryAnomalyCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a InventoryAnomaly.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAnomalyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InventoryAnomalyAggregateArgs>(args: Prisma.Subset<T, InventoryAnomalyAggregateArgs>): Prisma.PrismaPromise<GetInventoryAnomalyAggregateType<T>>;
    /**
     * Group by InventoryAnomaly.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAnomalyGroupByArgs} args - Group by arguments.
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
    groupBy<T extends InventoryAnomalyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: InventoryAnomalyGroupByArgs['orderBy'];
    } : {
        orderBy?: InventoryAnomalyGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, InventoryAnomalyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryAnomalyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the InventoryAnomaly model
     */
    readonly fields: InventoryAnomalyFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for InventoryAnomaly.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__InventoryAnomalyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
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
 * Fields of the InventoryAnomaly model
 */
export interface InventoryAnomalyFieldRefs {
    readonly id: Prisma.FieldRef<"InventoryAnomaly", 'String'>;
    readonly id_cabang: Prisma.FieldRef<"InventoryAnomaly", 'String'>;
    readonly nama_cabang: Prisma.FieldRef<"InventoryAnomaly", 'String'>;
    readonly item: Prisma.FieldRef<"InventoryAnomaly", 'String'>;
    readonly stok_lama: Prisma.FieldRef<"InventoryAnomaly", 'Int'>;
    readonly stok_baru: Prisma.FieldRef<"InventoryAnomaly", 'Int'>;
    readonly alasan: Prisma.FieldRef<"InventoryAnomaly", 'String'>;
    readonly timestamp: Prisma.FieldRef<"InventoryAnomaly", 'DateTime'>;
}
/**
 * InventoryAnomaly findUnique
 */
export type InventoryAnomalyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAnomaly
     */
    select?: Prisma.InventoryAnomalySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InventoryAnomaly
     */
    omit?: Prisma.InventoryAnomalyOmit<ExtArgs> | null;
    /**
     * Filter, which InventoryAnomaly to fetch.
     */
    where: Prisma.InventoryAnomalyWhereUniqueInput;
};
/**
 * InventoryAnomaly findUniqueOrThrow
 */
export type InventoryAnomalyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAnomaly
     */
    select?: Prisma.InventoryAnomalySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InventoryAnomaly
     */
    omit?: Prisma.InventoryAnomalyOmit<ExtArgs> | null;
    /**
     * Filter, which InventoryAnomaly to fetch.
     */
    where: Prisma.InventoryAnomalyWhereUniqueInput;
};
/**
 * InventoryAnomaly findFirst
 */
export type InventoryAnomalyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAnomaly
     */
    select?: Prisma.InventoryAnomalySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InventoryAnomaly
     */
    omit?: Prisma.InventoryAnomalyOmit<ExtArgs> | null;
    /**
     * Filter, which InventoryAnomaly to fetch.
     */
    where?: Prisma.InventoryAnomalyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InventoryAnomalies to fetch.
     */
    orderBy?: Prisma.InventoryAnomalyOrderByWithRelationInput | Prisma.InventoryAnomalyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for InventoryAnomalies.
     */
    cursor?: Prisma.InventoryAnomalyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InventoryAnomalies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InventoryAnomalies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of InventoryAnomalies.
     */
    distinct?: Prisma.InventoryAnomalyScalarFieldEnum | Prisma.InventoryAnomalyScalarFieldEnum[];
};
/**
 * InventoryAnomaly findFirstOrThrow
 */
export type InventoryAnomalyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAnomaly
     */
    select?: Prisma.InventoryAnomalySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InventoryAnomaly
     */
    omit?: Prisma.InventoryAnomalyOmit<ExtArgs> | null;
    /**
     * Filter, which InventoryAnomaly to fetch.
     */
    where?: Prisma.InventoryAnomalyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InventoryAnomalies to fetch.
     */
    orderBy?: Prisma.InventoryAnomalyOrderByWithRelationInput | Prisma.InventoryAnomalyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for InventoryAnomalies.
     */
    cursor?: Prisma.InventoryAnomalyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InventoryAnomalies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InventoryAnomalies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of InventoryAnomalies.
     */
    distinct?: Prisma.InventoryAnomalyScalarFieldEnum | Prisma.InventoryAnomalyScalarFieldEnum[];
};
/**
 * InventoryAnomaly findMany
 */
export type InventoryAnomalyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAnomaly
     */
    select?: Prisma.InventoryAnomalySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InventoryAnomaly
     */
    omit?: Prisma.InventoryAnomalyOmit<ExtArgs> | null;
    /**
     * Filter, which InventoryAnomalies to fetch.
     */
    where?: Prisma.InventoryAnomalyWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of InventoryAnomalies to fetch.
     */
    orderBy?: Prisma.InventoryAnomalyOrderByWithRelationInput | Prisma.InventoryAnomalyOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing InventoryAnomalies.
     */
    cursor?: Prisma.InventoryAnomalyWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` InventoryAnomalies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` InventoryAnomalies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of InventoryAnomalies.
     */
    distinct?: Prisma.InventoryAnomalyScalarFieldEnum | Prisma.InventoryAnomalyScalarFieldEnum[];
};
/**
 * InventoryAnomaly create
 */
export type InventoryAnomalyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAnomaly
     */
    select?: Prisma.InventoryAnomalySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InventoryAnomaly
     */
    omit?: Prisma.InventoryAnomalyOmit<ExtArgs> | null;
    /**
     * The data needed to create a InventoryAnomaly.
     */
    data: Prisma.XOR<Prisma.InventoryAnomalyCreateInput, Prisma.InventoryAnomalyUncheckedCreateInput>;
};
/**
 * InventoryAnomaly createMany
 */
export type InventoryAnomalyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many InventoryAnomalies.
     */
    data: Prisma.InventoryAnomalyCreateManyInput | Prisma.InventoryAnomalyCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * InventoryAnomaly createManyAndReturn
 */
export type InventoryAnomalyCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAnomaly
     */
    select?: Prisma.InventoryAnomalySelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the InventoryAnomaly
     */
    omit?: Prisma.InventoryAnomalyOmit<ExtArgs> | null;
    /**
     * The data used to create many InventoryAnomalies.
     */
    data: Prisma.InventoryAnomalyCreateManyInput | Prisma.InventoryAnomalyCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * InventoryAnomaly update
 */
export type InventoryAnomalyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAnomaly
     */
    select?: Prisma.InventoryAnomalySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InventoryAnomaly
     */
    omit?: Prisma.InventoryAnomalyOmit<ExtArgs> | null;
    /**
     * The data needed to update a InventoryAnomaly.
     */
    data: Prisma.XOR<Prisma.InventoryAnomalyUpdateInput, Prisma.InventoryAnomalyUncheckedUpdateInput>;
    /**
     * Choose, which InventoryAnomaly to update.
     */
    where: Prisma.InventoryAnomalyWhereUniqueInput;
};
/**
 * InventoryAnomaly updateMany
 */
export type InventoryAnomalyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update InventoryAnomalies.
     */
    data: Prisma.XOR<Prisma.InventoryAnomalyUpdateManyMutationInput, Prisma.InventoryAnomalyUncheckedUpdateManyInput>;
    /**
     * Filter which InventoryAnomalies to update
     */
    where?: Prisma.InventoryAnomalyWhereInput;
    /**
     * Limit how many InventoryAnomalies to update.
     */
    limit?: number;
};
/**
 * InventoryAnomaly updateManyAndReturn
 */
export type InventoryAnomalyUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAnomaly
     */
    select?: Prisma.InventoryAnomalySelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the InventoryAnomaly
     */
    omit?: Prisma.InventoryAnomalyOmit<ExtArgs> | null;
    /**
     * The data used to update InventoryAnomalies.
     */
    data: Prisma.XOR<Prisma.InventoryAnomalyUpdateManyMutationInput, Prisma.InventoryAnomalyUncheckedUpdateManyInput>;
    /**
     * Filter which InventoryAnomalies to update
     */
    where?: Prisma.InventoryAnomalyWhereInput;
    /**
     * Limit how many InventoryAnomalies to update.
     */
    limit?: number;
};
/**
 * InventoryAnomaly upsert
 */
export type InventoryAnomalyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAnomaly
     */
    select?: Prisma.InventoryAnomalySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InventoryAnomaly
     */
    omit?: Prisma.InventoryAnomalyOmit<ExtArgs> | null;
    /**
     * The filter to search for the InventoryAnomaly to update in case it exists.
     */
    where: Prisma.InventoryAnomalyWhereUniqueInput;
    /**
     * In case the InventoryAnomaly found by the `where` argument doesn't exist, create a new InventoryAnomaly with this data.
     */
    create: Prisma.XOR<Prisma.InventoryAnomalyCreateInput, Prisma.InventoryAnomalyUncheckedCreateInput>;
    /**
     * In case the InventoryAnomaly was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.InventoryAnomalyUpdateInput, Prisma.InventoryAnomalyUncheckedUpdateInput>;
};
/**
 * InventoryAnomaly delete
 */
export type InventoryAnomalyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAnomaly
     */
    select?: Prisma.InventoryAnomalySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InventoryAnomaly
     */
    omit?: Prisma.InventoryAnomalyOmit<ExtArgs> | null;
    /**
     * Filter which InventoryAnomaly to delete.
     */
    where: Prisma.InventoryAnomalyWhereUniqueInput;
};
/**
 * InventoryAnomaly deleteMany
 */
export type InventoryAnomalyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which InventoryAnomalies to delete
     */
    where?: Prisma.InventoryAnomalyWhereInput;
    /**
     * Limit how many InventoryAnomalies to delete.
     */
    limit?: number;
};
/**
 * InventoryAnomaly without action
 */
export type InventoryAnomalyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryAnomaly
     */
    select?: Prisma.InventoryAnomalySelect<ExtArgs> | null;
    /**
     * Omit specific fields from the InventoryAnomaly
     */
    omit?: Prisma.InventoryAnomalyOmit<ExtArgs> | null;
};
//# sourceMappingURL=InventoryAnomaly.d.ts.map