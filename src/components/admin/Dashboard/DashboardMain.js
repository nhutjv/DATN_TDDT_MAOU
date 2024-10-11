import React from 'react';
import UsersTable from '../Dashboard/UsersTable';
import SimpleCard from '../Dashboard/SimpleCard';

const Dashboard = () => {
  const cards = [
    { color: 'bg-pink-500', initials: 'ND', title: 'Người dùng', members: 120 }, 
    { color: 'bg-purple-500', initials: 'SP', title: 'Sản phẩm', members: 240 }, 
    { color: 'bg-yellow-500', initials: 'ĐH', title: 'Đơn hàng', members: 60 },
    { color: 'bg-green-500', initials: 'TH', title: 'Thương hiệu', members: 15 },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Các Dự Án Được Ghim</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, index) => (
          <SimpleCard
            key={index}
            color={card.color}
            initials={card.initials}
            title={card.title}
            members={card.members}
          />
        ))}
      </div>
      <UsersTable />
    </div>
  );
};

export default Dashboard;
