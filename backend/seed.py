from app.database import SessionLocal
from app.models.hcp import HCP
from app.database import Base, engine


Base.metadata.create_all(bind=engine)


db = SessionLocal()


hcp_data = [

    HCP(
        full_name="Dr. Amit Sharma",
        specialty="Cardiologist",
        hospital="Apollo Hospital",
        city="Bangalore",
        tier="A",
        email="amit@gmail.com",
        phone="9876543210"
    ),

    HCP(
        full_name="Dr. Priya Verma",
        specialty="Neurologist",
        hospital="Manipal Hospital",
        city="Bangalore",
        tier="A",
        email="priya@gmail.com",
        phone="9876543211"
    ),

    HCP(
        full_name="Dr. Raj Kumar",
        specialty="Oncologist",
        hospital="Fortis Hospital",
        city="Delhi",
        tier="B",
        email="raj@gmail.com",
        phone="9876543212"
    )

]


db.add_all(hcp_data)

db.commit()

db.close()


print("HCP data inserted successfully")