import prisma from '@/lib/prisma'; 
import { Customer, CreateCustomerData, UpdateCustomerData } from '@/types';

interface FindAllParams {
  search?: string;
};

export async function findAllCustomers(
  params: FindAllParams = {} 
): Promise<Customer[]> {

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