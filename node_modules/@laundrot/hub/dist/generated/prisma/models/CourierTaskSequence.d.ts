import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model CourierTaskSequence
 *
 */
export type CourierTaskSequenceModel = runtime.Types.Result.DefaultSelection<Prisma.$CourierTaskSequencePayload>;
export type AggregateCourierTaskSequence = {
    _count: CourierTaskSequenceCountAggregateOutputType | null;
    _avg: CourierTaskSequenceAvgAggregateOutputType | null;
    _sum: CourierTaskSequenceSumAggregateOutputType | null;
    _min: CourierTaskSequenceMinAggregateOutputType | null;
    _max: CourierTaskSequenceMaxAggregateOutputType | null;
};
export type CourierTaskSequenceAvgAggregateOutputType = {
    urutan: number | null;
};
export type CourierTaskSequenceSumAggregateOutputType = {
    urutan: number | null;
};
export type CourierTaskSequenceMinAggregateOutputType = {
    id: string | null;
    id_kurir: string | null;
    id_order: string | null;
    urutan: number | null;
};
export type CourierTaskSequenceMaxAggregateOutputType = {
    id: string | null;
    id_kurir: string | null;
    id_order: string | null;
    urutan: number | null;
};
export type CourierTaskSequenceCountAggregateOutputType = {
    id: number;
    id_kurir: number;
    id_order: number;
    urutan: number;
    _all: number;
};
export type CourierTaskSequenceAvgAggregateInputType = {
    urutan?: true;
};
export type CourierTaskSequenceSumAggregateInputType = {
    urutan?: true;
};
export type CourierTaskSequenceMinAggregateInputType = {
    id?: true;
    id_kurir?: true;
    id_order?: true;
    urutan?: true;
};
export type CourierTaskSequenceMaxAggregateInputType = {
    id?: true;
    id_kurir?: true;
    id_order?: true;
    urutan?: true;
};
export type CourierTaskSequenceCountAggregateInputType = {
    id?: true;
    id_kurir?: true;
    id_order?: true;
    urutan?: true;
    _all?: true;
};
export type CourierTaskSequenceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which CourierTaskSequence to aggregate.
     */
    where?: Prisma.CourierTaskSequenceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CourierTaskSequences to fetch.
     */
    orderBy?: Prisma.CourierTaskSequenceOrderByWithRelationInput | Prisma.CourierTaskSequenceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.CourierTaskSequenceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CourierTaskSequences from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CourierTaskSequences.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned CourierTaskSequences
    **/
    _count?: true | CourierTaskSequenceCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: CourierTaskSequenceAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: CourierTaskSequenceSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: CourierTaskSequenceMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: CourierTaskSequenceMaxAggregateInputType;
};
export type GetCourierTaskSequenceAggregateType<T extends CourierTaskSequenceAggregateArgs> = {
    [P in keyof T & keyof AggregateCourierTaskSequence]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCourierTaskSequence[P]> : Prisma.GetScalarType<T[P], AggregateCourierTaskSequence[P]>;
};
export type CourierTaskSequenceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourierTaskSequenceWhereInput;
    orderBy?: Prisma.CourierTaskSequenceOrderByWithAggregationInput | Prisma.CourierTaskSequenceOrderByWithAggregationInput[];
    by: Prisma.CourierTaskSequenceScalarFieldEnum[] | Prisma.CourierTaskSequenceScalarFieldEnum;
    having?: Prisma.CourierTaskSequenceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CourierTaskSequenceCountAggregateInputType | true;
    _avg?: CourierTaskSequenceAvgAggregateInputType;
    _sum?: CourierTaskSequenceSumAggregateInputType;
    _min?: CourierTaskSequenceMinAggregateInputType;
    _max?: CourierTaskSequenceMaxAggregateInputType;
};
export type CourierTaskSequenceGroupByOutputType = {
    id: string;
    id_kurir: string;
    id_order: string;
    urutan: number;
    _count: CourierTaskSequenceCountAggregateOutputType | null;
    _avg: CourierTaskSequenceAvgAggregateOutputType | null;
    _sum: CourierTaskSequenceSumAggregateOutputType | null;
    _min: CourierTaskSequenceMinAggregateOutputType | null;
    _max: CourierTaskSequenceMaxAggregateOutputType | null;
};
export type GetCourierTaskSequenceGroupByPayload<T extends CourierTaskSequenceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CourierTaskSequenceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CourierTaskSequenceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CourierTaskSequenceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CourierTaskSequenceGroupByOutputType[P]>;
}>>;
export type CourierTaskSequenceWhereInput = {
    AND?: Prisma.CourierTaskSequenceWhereInput | Prisma.CourierTaskSequenceWhereInput[];
    OR?: Prisma.CourierTaskSequenceWhereInput[];
    NOT?: Prisma.CourierTaskSequenceWhereInput | Prisma.CourierTaskSequenceWhereInput[];
    id?: Prisma.StringFilter<"CourierTaskSequence"> | string;
    id_kurir?: Prisma.StringFilter<"CourierTaskSequence"> | string;
    id_order?: Prisma.StringFilter<"CourierTaskSequence"> | string;
    urutan?: Prisma.IntFilter<"CourierTaskSequence"> | number;
};
export type CourierTaskSequenceOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    id_kurir?: Prisma.SortOrder;
    id_order?: Prisma.SortOrder;
    urutan?: Prisma.SortOrder;
};
export type CourierTaskSequenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    id_kurir_id_order?: Prisma.CourierTaskSequenceId_kurirId_orderCompoundUniqueInput;
    AND?: Prisma.CourierTaskSequenceWhereInput | Prisma.CourierTaskSequenceWhereInput[];
    OR?: Prisma.CourierTaskSequenceWhereInput[];
    NOT?: Prisma.CourierTaskSequenceWhereInput | Prisma.CourierTaskSequenceWhereInput[];
    id_kurir?: Prisma.StringFilter<"CourierTaskSequence"> | string;
    id_order?: Prisma.StringFilter<"CourierTaskSequence"> | string;
    urutan?: Prisma.IntFilter<"CourierTaskSequence"> | number;
}, "id" | "id_kurir_id_order">;
export type CourierTaskSequenceOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    id_kurir?: Prisma.SortOrder;
    id_order?: Prisma.SortOrder;
    urutan?: Prisma.SortOrder;
    _count?: Prisma.CourierTaskSequenceCountOrderByAggregateInput;
    _avg?: Prisma.CourierTaskSequenceAvgOrderByAggregateInput;
    _max?: Prisma.CourierTaskSequenceMaxOrderByAggregateInput;
    _min?: Prisma.CourierTaskSequenceMinOrderByAggregateInput;
    _sum?: Prisma.CourierTaskSequenceSumOrderByAggregateInput;
};
export type CourierTaskSequenceScalarWhereWithAggregatesInput = {
    AND?: Prisma.CourierTaskSequenceScalarWhereWithAggregatesInput | Prisma.CourierTaskSequenceScalarWhereWithAggregatesInput[];
    OR?: Prisma.CourierTaskSequenceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CourierTaskSequenceScalarWhereWithAggregatesInput | Prisma.CourierTaskSequenceScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"CourierTaskSequence"> | string;
    id_kurir?: Prisma.StringWithAggregatesFilter<"CourierTaskSequence"> | string;
    id_order?: Prisma.StringWithAggregatesFilter<"CourierTaskSequence"> | string;
    urutan?: Prisma.IntWithAggregatesFilter<"CourierTaskSequence"> | number;
};
export type CourierTaskSequenceCreateInput = {
    id?: string;
    id_kurir: string;
    id_order: string;
    urutan: number;
};
export type CourierTaskSequenceUncheckedCreateInput = {
    id?: string;
    id_kurir: string;
    id_order: string;
    urutan: number;
};
export type CourierTaskSequenceUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    id_kurir?: Prisma.StringFieldUpdateOperationsInput | string;
    id_order?: Prisma.StringFieldUpdateOperationsInput | string;
    urutan?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CourierTaskSequenceUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    id_kurir?: Prisma.StringFieldUpdateOperationsInput | string;
    id_order?: Prisma.StringFieldUpdateOperationsInput | string;
    urutan?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CourierTaskSequenceCreateManyInput = {
    id?: string;
    id_kurir: string;
    id_order: string;
    urutan: number;
};
export type CourierTaskSequenceUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    id_kurir?: Prisma.StringFieldUpdateOperationsInput | string;
    id_order?: Prisma.StringFieldUpdateOperationsInput | string;
    urutan?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CourierTaskSequenceUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    id_kurir?: Prisma.StringFieldUpdateOperationsInput | string;
    id_order?: Prisma.StringFieldUpdateOperationsInput | string;
    urutan?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CourierTaskSequenceId_kurirId_orderCompoundUniqueInput = {
    id_kurir: string;
    id_order: string;
};
export type CourierTaskSequenceCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    id_kurir?: Prisma.SortOrder;
    id_order?: Prisma.SortOrder;
    urutan?: Prisma.SortOrder;
};
export type CourierTaskSequenceAvgOrderByAggregateInput = {
    urutan?: Prisma.SortOrder;
};
export type CourierTaskSequenceMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    id_kurir?: Prisma.SortOrder;
    id_order?: Prisma.SortOrder;
    urutan?: Prisma.SortOrder;
};
export type CourierTaskSequenceMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    id_kurir?: Prisma.SortOrder;
    id_order?: Prisma.SortOrder;
    urutan?: Prisma.SortOrder;
};
export type CourierTaskSequenceSumOrderByAggregateInput = {
    urutan?: Prisma.SortOrder;
};
export type CourierTaskSequenceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    id_kurir?: boolean;
    id_order?: boolean;
    urutan?: boolean;
}, ExtArgs["result"]["courierTaskSequence"]>;
export type CourierTaskSequenceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    id_kurir?: boolean;
    id_order?: boolean;
    urutan?: boolean;
}, ExtArgs["result"]["courierTaskSequence"]>;
export type CourierTaskSequenceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    id_kurir?: boolean;
    id_order?: boolean;
    urutan?: boolean;
}, ExtArgs["result"]["courierTaskSequence"]>;
export type CourierTaskSequenceSelectScalar = {
    id?: boolean;
    id_kurir?: boolean;
    id_order?: boolean;
    urutan?: boolean;
};
export type CourierTaskSequenceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "id_kurir" | "id_order" | "urutan", ExtArgs["result"]["courierTaskSequence"]>;
export type $CourierTaskSequencePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CourierTaskSequence";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        id_kurir: string;
        id_order: string;
        urutan: number;
    }, ExtArgs["result"]["courierTaskSequence"]>;
    composites: {};
};
export type CourierTaskSequenceGetPayload<S extends boolean | null | undefined | CourierTaskSequenceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CourierTaskSequencePayload, S>;
export type CourierTaskSequenceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CourierTaskSequenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CourierTaskSequenceCountAggregateInputType | true;
};
export interface CourierTaskSequenceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CourierTaskSequence'];
        meta: {
            name: 'CourierTaskSequence';
        };
    };
    /**
     * Find zero or one CourierTaskSequence that matches the filter.
     * @param {CourierTaskSequenceFindUniqueArgs} args - Arguments to find a CourierTaskSequence
     * @example
     * // Get one CourierTaskSequence
     * const courierTaskSequence = await prisma.courierTaskSequence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CourierTaskSequenceFindUniqueArgs>(args: Prisma.SelectSubset<T, CourierTaskSequenceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CourierTaskSequenceClient<runtime.Types.Result.GetResult<Prisma.$CourierTaskSequencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one CourierTaskSequence that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CourierTaskSequenceFindUniqueOrThrowArgs} args - Arguments to find a CourierTaskSequence
     * @example
     * // Get one CourierTaskSequence
     * const courierTaskSequence = await prisma.courierTaskSequence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CourierTaskSequenceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CourierTaskSequenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourierTaskSequenceClient<runtime.Types.Result.GetResult<Prisma.$CourierTaskSequencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first CourierTaskSequence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourierTaskSequenceFindFirstArgs} args - Arguments to find a CourierTaskSequence
     * @example
     * // Get one CourierTaskSequence
     * const courierTaskSequence = await prisma.courierTaskSequence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CourierTaskSequenceFindFirstArgs>(args?: Prisma.SelectSubset<T, CourierTaskSequenceFindFirstArgs<ExtArgs>>): Prisma.Prisma__CourierTaskSequenceClient<runtime.Types.Result.GetResult<Prisma.$CourierTaskSequencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first CourierTaskSequence that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourierTaskSequenceFindFirstOrThrowArgs} args - Arguments to find a CourierTaskSequence
     * @example
     * // Get one CourierTaskSequence
     * const courierTaskSequence = await prisma.courierTaskSequence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CourierTaskSequenceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CourierTaskSequenceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourierTaskSequenceClient<runtime.Types.Result.GetResult<Prisma.$CourierTaskSequencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more CourierTaskSequences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourierTaskSequenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CourierTaskSequences
     * const courierTaskSequences = await prisma.courierTaskSequence.findMany()
     *
     * // Get first 10 CourierTaskSequences
     * const courierTaskSequences = await prisma.courierTaskSequence.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const courierTaskSequenceWithIdOnly = await prisma.courierTaskSequence.findMany({ select: { id: true } })
     *
     */
    findMany<T extends CourierTaskSequenceFindManyArgs>(args?: Prisma.SelectSubset<T, CourierTaskSequenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourierTaskSequencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a CourierTaskSequence.
     * @param {CourierTaskSequenceCreateArgs} args - Arguments to create a CourierTaskSequence.
     * @example
     * // Create one CourierTaskSequence
     * const CourierTaskSequence = await prisma.courierTaskSequence.create({
     *   data: {
     *     // ... data to create a CourierTaskSequence
     *   }
     * })
     *
     */
    create<T extends CourierTaskSequenceCreateArgs>(args: Prisma.SelectSubset<T, CourierTaskSequenceCreateArgs<ExtArgs>>): Prisma.Prisma__CourierTaskSequenceClient<runtime.Types.Result.GetResult<Prisma.$CourierTaskSequencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many CourierTaskSequences.
     * @param {CourierTaskSequenceCreateManyArgs} args - Arguments to create many CourierTaskSequences.
     * @example
     * // Create many CourierTaskSequences
     * const courierTaskSequence = await prisma.courierTaskSequence.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends CourierTaskSequenceCreateManyArgs>(args?: Prisma.SelectSubset<T, CourierTaskSequenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many CourierTaskSequences and returns the data saved in the database.
     * @param {CourierTaskSequenceCreateManyAndReturnArgs} args - Arguments to create many CourierTaskSequences.
     * @example
     * // Create many CourierTaskSequences
     * const courierTaskSequence = await prisma.courierTaskSequence.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many CourierTaskSequences and only return the `id`
     * const courierTaskSequenceWithIdOnly = await prisma.courierTaskSequence.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends CourierTaskSequenceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CourierTaskSequenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourierTaskSequencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a CourierTaskSequence.
     * @param {CourierTaskSequenceDeleteArgs} args - Arguments to delete one CourierTaskSequence.
     * @example
     * // Delete one CourierTaskSequence
     * const CourierTaskSequence = await prisma.courierTaskSequence.delete({
     *   where: {
     *     // ... filter to delete one CourierTaskSequence
     *   }
     * })
     *
     */
    delete<T extends CourierTaskSequenceDeleteArgs>(args: Prisma.SelectSubset<T, CourierTaskSequenceDeleteArgs<ExtArgs>>): Prisma.Prisma__CourierTaskSequenceClient<runtime.Types.Result.GetResult<Prisma.$CourierTaskSequencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one CourierTaskSequence.
     * @param {CourierTaskSequenceUpdateArgs} args - Arguments to update one CourierTaskSequence.
     * @example
     * // Update one CourierTaskSequence
     * const courierTaskSequence = await prisma.courierTaskSequence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends CourierTaskSequenceUpdateArgs>(args: Prisma.SelectSubset<T, CourierTaskSequenceUpdateArgs<ExtArgs>>): Prisma.Prisma__CourierTaskSequenceClient<runtime.Types.Result.GetResult<Prisma.$CourierTaskSequencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more CourierTaskSequences.
     * @param {CourierTaskSequenceDeleteManyArgs} args - Arguments to filter CourierTaskSequences to delete.
     * @example
     * // Delete a few CourierTaskSequences
     * const { count } = await prisma.courierTaskSequence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends CourierTaskSequenceDeleteManyArgs>(args?: Prisma.SelectSubset<T, CourierTaskSequenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more CourierTaskSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourierTaskSequenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CourierTaskSequences
     * const courierTaskSequence = await prisma.courierTaskSequence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends CourierTaskSequenceUpdateManyArgs>(args: Prisma.SelectSubset<T, CourierTaskSequenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more CourierTaskSequences and returns the data updated in the database.
     * @param {CourierTaskSequenceUpdateManyAndReturnArgs} args - Arguments to update many CourierTaskSequences.
     * @example
     * // Update many CourierTaskSequences
     * const courierTaskSequence = await prisma.courierTaskSequence.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more CourierTaskSequences and only return the `id`
     * const courierTaskSequenceWithIdOnly = await prisma.courierTaskSequence.updateManyAndReturn({
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
    updateManyAndReturn<T extends CourierTaskSequenceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CourierTaskSequenceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourierTaskSequencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one CourierTaskSequence.
     * @param {CourierTaskSequenceUpsertArgs} args - Arguments to update or create a CourierTaskSequence.
     * @example
     * // Update or create a CourierTaskSequence
     * const courierTaskSequence = await prisma.courierTaskSequence.upsert({
     *   create: {
     *     // ... data to create a CourierTaskSequence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CourierTaskSequence we want to update
     *   }
     * })
     */
    upsert<T extends CourierTaskSequenceUpsertArgs>(args: Prisma.SelectSubset<T, CourierTaskSequenceUpsertArgs<ExtArgs>>): Prisma.Prisma__CourierTaskSequenceClient<runtime.Types.Result.GetResult<Prisma.$CourierTaskSequencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of CourierTaskSequences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourierTaskSequenceCountArgs} args - Arguments to filter CourierTaskSequences to count.
     * @example
     * // Count the number of CourierTaskSequences
     * const count = await prisma.courierTaskSequence.count({
     *   where: {
     *     // ... the filter for the CourierTaskSequences we want to count
     *   }
     * })
    **/
    count<T extends CourierTaskSequenceCountArgs>(args?: Prisma.Subset<T, CourierTaskSequenceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CourierTaskSequenceCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a CourierTaskSequence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourierTaskSequenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CourierTaskSequenceAggregateArgs>(args: Prisma.Subset<T, CourierTaskSequenceAggregateArgs>): Prisma.PrismaPromise<GetCourierTaskSequenceAggregateType<T>>;
    /**
     * Group by CourierTaskSequence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourierTaskSequenceGroupByArgs} args - Group by arguments.
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
    groupBy<T extends CourierTaskSequenceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CourierTaskSequenceGroupByArgs['orderBy'];
    } : {
        orderBy?: CourierTaskSequenceGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CourierTaskSequenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourierTaskSequenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the CourierTaskSequence model
     */
    readonly fields: CourierTaskSequenceFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for CourierTaskSequence.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__CourierTaskSequenceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
 * Fields of the CourierTaskSequence model
 */
export interface CourierTaskSequenceFieldRefs {
    readonly id: Prisma.FieldRef<"CourierTaskSequence", 'String'>;
    readonly id_kurir: Prisma.FieldRef<"CourierTaskSequence", 'String'>;
    readonly id_order: Prisma.FieldRef<"CourierTaskSequence", 'String'>;
    readonly urutan: Prisma.FieldRef<"CourierTaskSequence", 'Int'>;
}
/**
 * CourierTaskSequence findUnique
 */
export type CourierTaskSequenceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierTaskSequence
     */
    select?: Prisma.CourierTaskSequenceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the CourierTaskSequence
     */
    omit?: Prisma.CourierTaskSequenceOmit<ExtArgs> | null;
    /**
     * Filter, which CourierTaskSequence to fetch.
     */
    where: Prisma.CourierTaskSequenceWhereUniqueInput;
};
/**
 * CourierTaskSequence findUniqueOrThrow
 */
export type CourierTaskSequenceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierTaskSequence
     */
    select?: Prisma.CourierTaskSequenceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the CourierTaskSequence
     */
    omit?: Prisma.CourierTaskSequenceOmit<ExtArgs> | null;
    /**
     * Filter, which CourierTaskSequence to fetch.
     */
    where: Prisma.CourierTaskSequenceWhereUniqueInput;
};
/**
 * CourierTaskSequence findFirst
 */
export type CourierTaskSequenceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierTaskSequence
     */
    select?: Prisma.CourierTaskSequenceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the CourierTaskSequence
     */
    omit?: Prisma.CourierTaskSequenceOmit<ExtArgs> | null;
    /**
     * Filter, which CourierTaskSequence to fetch.
     */
    where?: Prisma.CourierTaskSequenceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CourierTaskSequences to fetch.
     */
    orderBy?: Prisma.CourierTaskSequenceOrderByWithRelationInput | Prisma.CourierTaskSequenceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for CourierTaskSequences.
     */
    cursor?: Prisma.CourierTaskSequenceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CourierTaskSequences from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CourierTaskSequences.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of CourierTaskSequences.
     */
    distinct?: Prisma.CourierTaskSequenceScalarFieldEnum | Prisma.CourierTaskSequenceScalarFieldEnum[];
};
/**
 * CourierTaskSequence findFirstOrThrow
 */
export type CourierTaskSequenceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierTaskSequence
     */
    select?: Prisma.CourierTaskSequenceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the CourierTaskSequence
     */
    omit?: Prisma.CourierTaskSequenceOmit<ExtArgs> | null;
    /**
     * Filter, which CourierTaskSequence to fetch.
     */
    where?: Prisma.CourierTaskSequenceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CourierTaskSequences to fetch.
     */
    orderBy?: Prisma.CourierTaskSequenceOrderByWithRelationInput | Prisma.CourierTaskSequenceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for CourierTaskSequences.
     */
    cursor?: Prisma.CourierTaskSequenceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CourierTaskSequences from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CourierTaskSequences.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of CourierTaskSequences.
     */
    distinct?: Prisma.CourierTaskSequenceScalarFieldEnum | Prisma.CourierTaskSequenceScalarFieldEnum[];
};
/**
 * CourierTaskSequence findMany
 */
export type CourierTaskSequenceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierTaskSequence
     */
    select?: Prisma.CourierTaskSequenceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the CourierTaskSequence
     */
    omit?: Prisma.CourierTaskSequenceOmit<ExtArgs> | null;
    /**
     * Filter, which CourierTaskSequences to fetch.
     */
    where?: Prisma.CourierTaskSequenceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CourierTaskSequences to fetch.
     */
    orderBy?: Prisma.CourierTaskSequenceOrderByWithRelationInput | Prisma.CourierTaskSequenceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing CourierTaskSequences.
     */
    cursor?: Prisma.CourierTaskSequenceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CourierTaskSequences from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CourierTaskSequences.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of CourierTaskSequences.
     */
    distinct?: Prisma.CourierTaskSequenceScalarFieldEnum | Prisma.CourierTaskSequenceScalarFieldEnum[];
};
/**
 * CourierTaskSequence create
 */
export type CourierTaskSequenceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierTaskSequence
     */
    select?: Prisma.CourierTaskSequenceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the CourierTaskSequence
     */
    omit?: Prisma.CourierTaskSequenceOmit<ExtArgs> | null;
    /**
     * The data needed to create a CourierTaskSequence.
     */
    data: Prisma.XOR<Prisma.CourierTaskSequenceCreateInput, Prisma.CourierTaskSequenceUncheckedCreateInput>;
};
/**
 * CourierTaskSequence createMany
 */
export type CourierTaskSequenceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many CourierTaskSequences.
     */
    data: Prisma.CourierTaskSequenceCreateManyInput | Prisma.CourierTaskSequenceCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * CourierTaskSequence createManyAndReturn
 */
export type CourierTaskSequenceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierTaskSequence
     */
    select?: Prisma.CourierTaskSequenceSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the CourierTaskSequence
     */
    omit?: Prisma.CourierTaskSequenceOmit<ExtArgs> | null;
    /**
     * The data used to create many CourierTaskSequences.
     */
    data: Prisma.CourierTaskSequenceCreateManyInput | Prisma.CourierTaskSequenceCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * CourierTaskSequence update
 */
export type CourierTaskSequenceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierTaskSequence
     */
    select?: Prisma.CourierTaskSequenceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the CourierTaskSequence
     */
    omit?: Prisma.CourierTaskSequenceOmit<ExtArgs> | null;
    /**
     * The data needed to update a CourierTaskSequence.
     */
    data: Prisma.XOR<Prisma.CourierTaskSequenceUpdateInput, Prisma.CourierTaskSequenceUncheckedUpdateInput>;
    /**
     * Choose, which CourierTaskSequence to update.
     */
    where: Prisma.CourierTaskSequenceWhereUniqueInput;
};
/**
 * CourierTaskSequence updateMany
 */
export type CourierTaskSequenceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update CourierTaskSequences.
     */
    data: Prisma.XOR<Prisma.CourierTaskSequenceUpdateManyMutationInput, Prisma.CourierTaskSequenceUncheckedUpdateManyInput>;
    /**
     * Filter which CourierTaskSequences to update
     */
    where?: Prisma.CourierTaskSequenceWhereInput;
    /**
     * Limit how many CourierTaskSequences to update.
     */
    limit?: number;
};
/**
 * CourierTaskSequence updateManyAndReturn
 */
export type CourierTaskSequenceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierTaskSequence
     */
    select?: Prisma.CourierTaskSequenceSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the CourierTaskSequence
     */
    omit?: Prisma.CourierTaskSequenceOmit<ExtArgs> | null;
    /**
     * The data used to update CourierTaskSequences.
     */
    data: Prisma.XOR<Prisma.CourierTaskSequenceUpdateManyMutationInput, Prisma.CourierTaskSequenceUncheckedUpdateManyInput>;
    /**
     * Filter which CourierTaskSequences to update
     */
    where?: Prisma.CourierTaskSequenceWhereInput;
    /**
     * Limit how many CourierTaskSequences to update.
     */
    limit?: number;
};
/**
 * CourierTaskSequence upsert
 */
export type CourierTaskSequenceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierTaskSequence
     */
    select?: Prisma.CourierTaskSequenceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the CourierTaskSequence
     */
    omit?: Prisma.CourierTaskSequenceOmit<ExtArgs> | null;
    /**
     * The filter to search for the CourierTaskSequence to update in case it exists.
     */
    where: Prisma.CourierTaskSequenceWhereUniqueInput;
    /**
     * In case the CourierTaskSequence found by the `where` argument doesn't exist, create a new CourierTaskSequence with this data.
     */
    create: Prisma.XOR<Prisma.CourierTaskSequenceCreateInput, Prisma.CourierTaskSequenceUncheckedCreateInput>;
    /**
     * In case the CourierTaskSequence was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.CourierTaskSequenceUpdateInput, Prisma.CourierTaskSequenceUncheckedUpdateInput>;
};
/**
 * CourierTaskSequence delete
 */
export type CourierTaskSequenceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierTaskSequence
     */
    select?: Prisma.CourierTaskSequenceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the CourierTaskSequence
     */
    omit?: Prisma.CourierTaskSequenceOmit<ExtArgs> | null;
    /**
     * Filter which CourierTaskSequence to delete.
     */
    where: Prisma.CourierTaskSequenceWhereUniqueInput;
};
/**
 * CourierTaskSequence deleteMany
 */
export type CourierTaskSequenceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which CourierTaskSequences to delete
     */
    where?: Prisma.CourierTaskSequenceWhereInput;
    /**
     * Limit how many CourierTaskSequences to delete.
     */
    limit?: number;
};
/**
 * CourierTaskSequence without action
 */
export type CourierTaskSequenceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourierTaskSequence
     */
    select?: Prisma.CourierTaskSequenceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the CourierTaskSequence
     */
    omit?: Prisma.CourierTaskSequenceOmit<ExtArgs> | null;
};
//# sourceMappingURL=CourierTaskSequence.d.ts.map