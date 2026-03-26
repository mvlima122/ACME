import prisma from '@/lib/prisma'; 
import { Customer, 
         CreateCustomerData, 
         UpdateCustomerData,
         FindAllCustomersParams,
         PaginatedResponse
         } from '@/types';

const SORTABLE_FIELDS = ['name', 'email'] as const;  

type SortableFields = (typeof SORTABLE_FIELDS)[number];

function isSortableFields(value: string) {
  return (SORTABLE_FIELDS as readonly string[]).includes(value);
};

interface FindAllParams {
  search?: string;
};

export async function findAllCustomers(
  params: FindAllCustomersParams
): Promise<PaginatedResponse<Customer>> {

const {search} = params;

  const customer = await prisma.customer.findMany({
    where: search ? {
      OR: [
        {name:{ contains: search, mode: 'insensitive'}},
        {email:{ contains: search, mode: 'insensitive'}}
      ]
    } : undefined,
    orderBy: {name: 'asc'}
  });

  return customer;

};

export async function findCustomerById(
  id: string
): Promise<Customer|null> {

  const customer = await prisma.customer.findUnique ({
    where: { id }
  });

  return customer;

};

export async function createCustomer(
  data:CreateCustomerData
): Promise<Customer> {

  const customer = await prisma.customer.create({
    data
  });
  
  return customer;
};

export async function updateCustomer(
  id: string,
  data:UpdateCustomerData

): Promise<Customer> {

  const customer = await prisma.customer.update({
    where: { id },
    data
  });

  return customer;
};

export async function deleteCustomer(
  id: string,
): Promise<void> {

  await prisma.customer.delete({
    where: { id },
  });
};