import { PrismaClient, InvoiceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Acme } from 'next/font/google';
import { useImperativeHandle } from 'react';

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando população do banco de dados...');

    const password = await bcrypt.hash('password', 10);

    const user = prisma.user.upsert({
        where: { email: 'admin@acme.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@acme.com',
            password: password
        }
    });
    console.log('Usuário criado com sucesso.');

    const customer_data = [{
        name: 'Maria Vitoria',
        email: 'maria@email.com',
        imageUrl: 'https://ui-avatars.com/api/?nome=Maria+Vitoria&background=random'
    }, {
        name: 'Marcelo Correia',
        email: 'marcelo@email.com',
        imageUrl: 'https://ui-avatars.com/api/?nome=Marcelo+Correia&background=random'

    }, {
        name: 'Ivanda Lima',
        email: 'ivanda@email.com',
        imageUrl: 'https://ui-avatars.com/api/?nome=Ivanda+Lima&background=random'
    }];

    const customers = [];

    for (const data of customer_data) {
        const customer = await prisma.customer.upsert({
            where: { email: data.email },
            update: {},
            create: data
        });

        customers.push(customer);
        console.log(`Cliente criado: ${customer.name}`);
    };

    const invoiceData = [
        {
            amount: 15785,
            status: InvoiceStatus.PENDENTE,
            date: '2026-29-05',
            customer: customers[0]
        }, {
            amount: 1578,
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05',
            customer: customers[1]
        }, {
            amount: 5722,
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05',
            customer: customers[2]
        }, {
            amount: 154335785,
            status: InvoiceStatus.PENDENTE,
            date: '2026-12-05',
            customer: customers[0]
        }, {
            amount: 1578,
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05',
            customer: customers[1]
        }, {
            amount: 15474785,
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05',
            customer: customers[2]
        }, {
            amount: 4747,
            status: InvoiceStatus.PAGO,
            date: '2026-05-05',
            customer: customers[0]
        }, {
            amount: 747,
            status: InvoiceStatus.PENDENTE,
            date: '2026-16-05',
            customer: customers[1]
        }, {
            amount: 7575,
            status: InvoiceStatus.PENDENTE,
            date: '2026-17-05',
            customer: customers[2]
        }, {
            amount: 5777,
            status: InvoiceStatus.PAGO,
            date: '2026-01-05',
            customer: customers[0]
        }, {
            amount: 5757,
            status: InvoiceStatus.PENDENTE,
            date: '2026-20-05',
            customer: customers[1]
        }, {
            amount: 1573,
            status: InvoiceStatus.PAGO,
            date: '2026-06-05',
            customer: customers[2]
        }];

    for (const data of invoiceData) {
        await prisma.invoice.create({
            data: {
                amount: data.amount,
                status: data.status,
                date: new Date(data.date),
                customerId: data.customer.id
            }
        });
    };

    console.log(`${invoiceData.length} faturas criadas.`);

    const revenueData = [
        { month: 'Jan', revenue: 65748461 },
        { month: 'Fev', revenue: 65748462 },
        { month: 'Mar', revenue: 65748463 },
        { month: 'Abr', revenue: 65748464 },
        { month: 'Mai', revenue: 65748465 },
        { month: 'Jun', revenue: 65748466 },
        { month: 'Jul', revenue: 65748467 },
        { month: 'Ago', revenue: 65748468 },
        { month: 'Set', revenue: 65748469 },
        { month: 'Out', revenue: 657484600 },
        { month: 'Nov', revenue: 657484601 },
        { month: 'Dez', revenue: 657484602 },

    ];

    for (const data of revenueData) {
        await prisma.revenue.upsert({
            where: { month: data.month },
            update: { revenue: data.revenue }, 
            create: data
        });
    };

    console.log('Dados de receita mensal criados.');

    console.log('População concluída com sucesso.');

};

main()
  .catch((erro)=> {
    console.log('Erro ao popular o banco:', erro);
  })
  .finally ( async () => {
    await prisma.$disconnect();
  });