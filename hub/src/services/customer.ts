import { prisma } from '../lib/prisma.js';
import type { Customer as PrismaCustomer } from '../generated/prisma/client.js';
import { getBranchById } from '../config/branches.js';

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

export async function createCustomer(data: CreateCustomerInput): Promise<CustomerResponse> {
  const customer = await prisma.customer.create({
    data: {
      id_cabang: data.id_cabang,
      nama: data.nama,
      whatsapp: data.whatsapp,
      alamat_maps: data.alamat_maps,
      google_maps_url: data.google_maps_url,
    },
  });

  return {
    id_pelanggan: customer.id_pelanggan,
    id_cabang: customer.id_cabang,
    nama: customer.nama,
    whatsapp: customer.whatsapp,
    alamat_maps: customer.alamat_maps,
    google_maps_url: customer.google_maps_url ?? undefined,
    created_at: customer.created_at,
  };
}

export async function getCustomersByBranch(id_cabang: string): Promise<CustomerResponse[]> {
  const customers = await prisma.customer.findMany({
    where: { id_cabang },
    orderBy: { created_at: 'desc' },
  });

  return customers.map((c: PrismaCustomer) => ({
    id_pelanggan: c.id_pelanggan,
    id_cabang: c.id_cabang,
    nama: c.nama,
    whatsapp: c.whatsapp,
    alamat_maps: c.alamat_maps,
    google_maps_url: c.google_maps_url ?? undefined,
    created_at: c.created_at,
  }));
}

export async function getAllCustomers(): Promise<CustomerResponse[]> {
  const customers = await prisma.customer.findMany({
    orderBy: { created_at: 'desc' },
  });

  return customers.map((c: PrismaCustomer) => ({
    id_pelanggan: c.id_pelanggan,
    id_cabang: c.id_cabang,
    nama: c.nama,
    whatsapp: c.whatsapp,
    alamat_maps: c.alamat_maps,
    google_maps_url: c.google_maps_url ?? undefined,
    created_at: c.created_at,
  }));
}

export async function getCustomerById(id_pelanggan: string): Promise<CustomerResponse | null> {
  const customer = await prisma.customer.findUnique({
    where: { id_pelanggan },
  });

  if (!customer) return null;

  return {
    id_pelanggan: customer.id_pelanggan,
    id_cabang: customer.id_cabang,
    nama: customer.nama,
    whatsapp: customer.whatsapp,
    alamat_maps: customer.alamat_maps,
    google_maps_url: customer.google_maps_url ?? undefined,
    created_at: customer.created_at,
  };
}

export async function updateCustomer(
  id_pelanggan: string,
  data: Partial<CreateCustomerInput>
): Promise<CustomerResponse | null> {
  const customer = await prisma.customer.update({
    where: { id_pelanggan },
    data: {
      ...(data.nama && { nama: data.nama }),
      ...(data.whatsapp && { whatsapp: data.whatsapp }),
      ...(data.alamat_maps && { alamat_maps: data.alamat_maps }),
      ...(data.google_maps_url !== undefined && { google_maps_url: data.google_maps_url }),
    },
  });

  return {
    id_pelanggan: customer.id_pelanggan,
    id_cabang: customer.id_cabang,
    nama: customer.nama,
    whatsapp: customer.whatsapp,
    alamat_maps: customer.alamat_maps,
    google_maps_url: customer.google_maps_url ?? undefined,
    created_at: customer.created_at,
  };
}

export async function deleteCustomer(id_pelanggan: string): Promise<boolean> {
  try {
    await prisma.customer.delete({
      where: { id_pelanggan },
    });
    return true;
  } catch {
    return false;
  }
}

export async function searchCustomers(id_cabang: string, query: string): Promise<CustomerResponse[]> {
  const customers = await prisma.customer.findMany({
    where: {
      id_cabang,
      OR: [
        { nama: { contains: query, mode: 'insensitive' } },
        { whatsapp: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { created_at: 'desc' },
    take: 20,
  });

  return customers.map((c: PrismaCustomer) => ({
    id_pelanggan: c.id_pelanggan,
    id_cabang: c.id_cabang,
    nama: c.nama,
    whatsapp: c.whatsapp,
    alamat_maps: c.alamat_maps,
    google_maps_url: c.google_maps_url ?? undefined,
    created_at: c.created_at,
  }));
}
