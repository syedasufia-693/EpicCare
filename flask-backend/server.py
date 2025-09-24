from flask import Flask,request,jsonify
import tensorflow as tf
from flask_cors import CORS 
from sklearn.preprocessing import Normalizer
from sklearn.preprocessing import MinMaxScaler
from sklearn import preprocessing
import numpy as np
from keras.initializers import Orthogonal
from keras.layers import LSTM
from tensorflow.keras.models import load_model


app = Flask(__name__)
CORS(app)


symptoms_list = [
    "itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing",
    "shivering", "chills", "joint_pain", "stomach_pain", "acidity",
    "ulcers_on_tongue", "muscle_wasting", "vomiting", "burning_micturition",
    "fatigue", "weight_gain", "anxiety", "cold_hands_and_feets", "mood_swings",
    "weight_loss", "restlessness", "lethargy", "patches_in_throat",
    "irregular_sugar_level", "cough", "high_fever", "sunken_eyes",
    "breathlessness", "sweating", "dehydration", "indigestion", "headache",
    "yellowish_skin", "dark_urine", "nausea", "loss_of_appetite",
    "pain_behind_the_eyes", "back_pain", "constipation", "abdominal_pain",
    "diarrhoea", "mild_fever", "yellow_urine", "yellowing_of_eyes",
    "acute_liver_failure", "fluid_overload", "swelling_of_stomach",
    "swelled_lymph_nodes", "malaise", "blurred_and_distorted_vision", "phlegm",
    "throat_irritation", "redness_of_eyes", "sinus_pressure", "runny_nose",
    "congestion", "chest_pain", "weakness_in_limbs", "fast_heart_rate",
    "pain_during_bowel_movements", "pain_in_anal_region", "bloody_stool",
    "irritation_in_anus", "neck_pain", "dizziness", "cramps", "bruising",
    "obesity", "swollen_legs", "swollen_blood_vessels", "puffy_face_and_eyes",
    "enlarged_thyroid", "brittle_nails", "swollen_extremeties",
    "excessive_hunger", "extra_marital_contacts", "drying_and_tingling_lips",
    "slurred_speech", "knee_pain", "hip_joint_pain", "muscle_weakness",
    "stiff_neck", "swelling_joints", "movement_stiffness", "spinning_movements",
    "loss_of_balance", "unsteadiness", "weakness_of_one_body_side",
    "loss_of_smell", "bladder_discomfort", "continuous_feel_of_urine",
    "passage_of_gases", "internal_itching", "toxic_look_(typhos)", "depression",
    "irritability", "muscle_pain", "altered_sensorium", "red_spots_over_body",
    "belly_pain", "abnormal_menstruation", "watering_from_eyes",
    "increased_appetite", "polyuria", "family_history", "mucoid_sputum",
    "rusty_sputum", "lack_of_concentration", "visual_disturbances",
    "receiving_blood_transfusion", "receiving_unsterile_injections", "coma",
    "stomach_bleeding", "distention_of_abdomen", "history_of_alcohol_consumption",
    "blood_in_sputum", "prominent_veins_on_calf", "palpitations",
    "painful_walking", "pus_filled_pimples", "blackheads", "scurring",
    "skin_peeling", "silver_like_dusting", "small_dents_in_nails",
    "inflammatory_nails", "blister", "red_sore_around_nose", "yellow_crust_ooze",
    "prognosis", "skin rash", "pus filled pimples", "mood swings", "weight loss",
    "fast heart rate", "excessive hunger", "muscle weakness",
    "abnormal menstruation", "muscle wasting", "patches in throat", "high fever",
    "extra marital contacts", "yellowish skin", "loss of appetite",
    "abdominal pain", "yellowing of eyes", "chest pain", "loss of balance",
    "lack of concentration", "blurred and distorted vision",
    "drying and tingling lips", "slurred speech", "stiff neck", "swelling joints",
    "painful walking", "dark urine", "yellow urine", "receiving blood transfusion",
    "receiving unsterile injections", "visual disturbances",
    "burning micturition", "bladder discomfort", "foul smell of urine",
    "continuous feel of urine", "irregular sugar level", "increased appetite",
    "joint pain", "skin peeling", "small dents in nails", "inflammatory nails",
    "swelling of stomach", "distention of abdomen", "history of alcohol consumption",
    "fluid overload", "pain during bowel movements", "pain in anal region",
    "bloody stool", "irritation in anus", "acute liver failure", "stomach bleeding",
    "back pain", "weakness in limbs", "neck pain", "mucoid sputum",
    "mild fever", "muscle pain", "family history", "continuous sneezing",
    "watering from eyes", "rusty sputum", "weight gain", "puffy face and eyes",
    "enlarged thyroid", "brittle nails", "swollen extremeties", "swollen legs",
    "prominent veins on calf", "stomach pain", "spinning movements", "sunken eyes",
    "silver like dusting", "swelled lymph nodes", "blood in sputum",
    "swollen blood vessels", "toxic look (typhos)", "belly pain",
    "throat irritation", "redness of eyes", "sinus pressure", "runny nose",
    "loss of smell", "passage of gases", "cold hands and feets",
    "weakness of one body side", "altered sensorium", "nodal skin eruptions",
    "red sore around nose", "yellow crust ooze", "ulcers on tongue",
    "spotting urination", "pain behind the eyes", "red spots over body",
    "internal itching"
]


disease_description =[{'Disease': 'Drug Reaction', 'Description': 'An adverse drug reaction (ADR) is an injury caused by taking medication. ADRs may occur following a single dose or prolonged administration of a drug or result from the combination of two or more drugs.'}, {'Disease': 'Malaria', 'Description': 'An infectious disease caused by protozoan parasites from the Plasmodium family that can be transmitted by the bite of the Anopheles mosquito or by a contaminated needle or transfusion. Falciparum malaria is the most deadly type.'}, {'Disease': 'Allergy', 'Description': "An allergy is an immune system response to a foreign substance that's not typically harmful to your body.They can include certain foods, pollen, or pet dander. Your immune system's job is to keep you healthy by fighting harmful pathogens."}, {'Disease': 'Hypothyroidism', 'Description': 'Hypothyroidism, also called underactive thyroid or low thyroid, is a disorder of the endocrine system in which the thyroid gland does not produce enough thyroid hormone.'}, {'Disease': 'Psoriasis', 'Description': "Psoriasis is a common skin disorder that forms thick, red, bumpy patches covered with silvery scales. They can pop up anywhere, but most appear on the scalp, elbows, knees, and lower back. Psoriasis can't be passed from person to person. It does sometimes happen in members of the same family."}, {'Disease': 'GERD', 'Description': 'Gastroesophageal reflux disease, or GERD, is a digestive disorder that affects the lower esophageal sphincter (LES), the ring of muscle between the esophagus and stomach. Many people, including pregnant women, suffer from heartburn or acid indigestion caused by GERD.'}, {'Disease': 'Chronic cholestasis', 'Description': 'Chronic cholestatic diseases, whether occurring in infancy, childhood or adulthood, are characterized by defective bile acid transport from the liver to the intestine, which is caused by primary damage to the biliary epithelium in most cases'}, {'Disease': 'hepatitis A', 'Description': "Hepatitis A is a highly contagious liver infection caused by the hepatitis A virus. The virus is one of several types of hepatitis viruses that cause inflammation and affect your liver's ability to function."}, {'Disease': 'Osteoarthristis', 'Description': 'Osteoarthritis is the most common form of arthritis, affecting millions of people worldwide. It occurs when the protective cartilage that cushions the ends of your bones wears down over time.'}, {'Disease': '(vertigo) Paroymsal  Positional Vertigo', 'Description': "Benign paroxysmal positional vertigo (BPPV) is one of the most common causes of vertigo — the sudden sensation that you're spinning or that the inside of your head is spinning. Benign paroxysmal positional vertigo causes brief episodes of mild to intense dizziness."}, {'Disease': 'Hypoglycemia', 'Description': " Hypoglycemia is a condition in which your blood sugar (glucose) level is lower than normal. Glucose is your body's main energy source. Hypoglycemia is often related to diabetes treatment. But other drugs and a variety of conditions — many rare — can cause low blood sugar in people who don't have diabetes."}, {'Disease': 'Acne', 'Description': 'Acne vulgaris is the formation of comedones, papules, pustules, nodules, and/or cysts as a result of obstruction and inflammation of pilosebaceous units (hair follicles and their accompanying sebaceous gland). Acne develops on the face and upper trunk. It most often affects adolescents.'}, {'Disease': 'Diabetes', 'Description': 'Diabetes is a disease that occurs when your blood glucose, also called blood sugar, is too high. Blood glucose is your main source of energy and comes from the food you eat. Insulin, a hormone made by the pancreas, helps glucose from food get into your cells to be used for energy.'}, {'Disease': 'Impetigo', 'Description': "Impetigo (im-puh-TIE-go) is a common and highly contagious skin infection that mainly affects infants and children. Impetigo usually appears as red sores on the face, especially around a child's nose and mouth, and on hands and feet. The sores burst and develop honey-colored crusts."}, {'Disease': 'Hypertension', 'Description': 'Hypertension (HTN or HT), also known as high blood pressure (HBP), is a long-term medical condition in which the blood pressure in the arteries is persistently elevated. High blood pressure typically does not cause symptoms.'}, {'Disease': 'Peptic ulcer diseae', 'Description': 'Peptic ulcer disease (PUD) is a break in the inner lining of the stomach, the first part of the small intestine, or sometimes the lower esophagus. An ulcer in the stomach is called a gastric ulcer, while one in the first part of the intestines is a duodenal ulcer.'}, {'Disease': 'Dimorphic hemorrhoids(piles)', 'Description': 'Hemorrhoids, also spelled haemorrhoids, are vascular structures in the anal canal. In their ... Other names, Haemorrhoids, piles, hemorrhoidal disease .'}, {'Disease': 'Common Cold', 'Description': "The common cold is a viral infection of your nose and throat (upper respiratory tract). It's usually harmless, although it might not feel that way. Many types of viruses can cause a common cold."}, {'Disease': 'Chicken pox', 'Description': 'Chickenpox is a highly contagious disease caused by the varicella-zoster virus (VZV). It can cause an itchy, blister-like rash. The rash first appears on the chest, back, and face, and then spreads over the entire body, causing between 250 and 500 itchy blisters.'}, {'Disease': 'Cervical spondylosis', 'Description': 'Cervical spondylosis is a general term for age-related wear and tear affecting the spinal disks in your neck. As the disks dehydrate and shrink, signs of osteoarthritis develop, including bony projections along the edges of bones (bone spurs).'}, {'Disease': 'Hyperthyroidism', 'Description': "Hyperthyroidism (overactive thyroid) occurs when your thyroid gland produces too much of the hormone thyroxine. Hyperthyroidism can accelerate your body's metabolism, causing unintentional weight loss and a rapid or irregular heartbeat."}, {'Disease': 'Urinary tract infection', 'Description': 'Urinary tract infection: An infection of the kidney, ureter, bladder, or urethra. Abbreviated UTI. Not everyone with a UTI has symptoms, but common symptoms include a frequent urge to urinate and pain or burning when urinating.'}, {'Disease': 'Varicose veins', 'Description': 'A vein that has enlarged and twisted, often appearing as a bulging, blue blood vessel that is clearly visible through the skin. Varicose veins are most common in older adults, particularly women, and occur especially on the legs.'}, {'Disease': 'AIDS', 'Description': "Acquired immunodeficiency syndrome (AIDS) is a chronic, potentially life-threatening condition caused by the human immunodeficiency virus (HIV). By damaging your immune system, HIV interferes with your body's ability to fight infection and disease."}, {'Disease': 'Paralysis (brain hemorrhage)', 'Description': 'Intracerebral hemorrhage (ICH) is when blood suddenly bursts into brain tissue, causing damage to your brain. Symptoms usually appear suddenly during ICH. They include headache, weakness, confusion, and paralysis, particularly on one side of your body.'}, {'Disease': 'Typhoid', 'Description': 'An acute illness characterized by fever caused by infection with the bacterium Salmonella typhi. Typhoid fever has an insidious onset, with fever, headache, constipation, malaise, chills, and muscle pain. Diarrhea is uncommon, and vomiting is not usually severe.'}, {'Disease': 'Hepatitis B', 'Description': "Hepatitis B is an infection of your liver. It can cause scarring of the organ, liver failure, and cancer. It can be fatal if it isn't treated. It's spread when people come in contact with the blood, open sores, or body fluids of someone who has the hepatitis B virus."}, {'Disease': 'Fungal infection', 'Description': 'In humans, fungal infections occur when an invading fungus takes over an area of the body and is too much for the immune system to handle. Fungi can live in the air, soil, water, and plants. There are also some fungi that live naturally in the human body. Like many microbes, there are helpful fungi and harmful fungi.'}, {'Disease': 'Hepatitis C', 'Description': 'Inflammation of the liver due to the hepatitis C virus (HCV), which is usually spread via blood transfusion (rare), hemodialysis, and needle sticks. The damage hepatitis C does to the liver can lead to cirrhosis and its complications as well as cancer.'}, {'Disease': 'Migraine', 'Description': "A migraine can cause severe throbbing pain or a pulsing sensation, usually on one side of the head. It's often accompanied by nausea, vomiting, and extreme sensitivity to light and sound. Migraine attacks can last for hours to days, and the pain can be so severe that it interferes with your daily activities."}, {'Disease': 'Bronchial Asthma', 'Description': 'Bronchial asthma is a medical condition which causes the airway path of the lungs to swell and narrow. Due to this swelling, the air path produces excess mucus making it hard to breathe, which results in coughing, short breath, and wheezing. The disease is chronic and interferes with daily working.'}, {'Disease': 'Alcoholic hepatitis', 'Description': "Alcoholic hepatitis is a diseased, inflammatory condition of the liver caused by heavy alcohol consumption over an extended period of time. It's also aggravated by binge drinking and ongoing alcohol use. If you develop this condition, you must stop drinking alcohol"}, {'Disease': 'Jaundice', 'Description': 'Yellow staining of the skin and sclerae (the whites of the eyes) by abnormally high blood levels of the bile pigment bilirubin. The yellowing extends to other tissues and body fluids. Jaundice was once called the "morbus regius" (the regal disease) in the belief that only the touch of a king could cure it'}, {'Disease': 'Hepatitis E', 'Description': 'A rare form of liver inflammation caused by infection with the hepatitis E virus (HEV). It is transmitted via food or drink handled by an infected person or through infected water supplies in areas where fecal matter may get into the water. Hepatitis E does not cause chronic liver disease.'}, {'Disease': 'Dengue', 'Description': 'an acute infectious disease caused by a flavivirus (species Dengue virus of the genus Flavivirus), transmitted by aedes mosquitoes, and characterized by headache, severe joint pain, and a rash. — called also breakbone fever, dengue fever.'}, {'Disease': 'Hepatitis D', 'Description': 'Hepatitis D, also known as the hepatitis delta virus, is an infection that causes the liver to become inflamed. This swelling can impair liver function and cause long-term liver problems, including liver scarring and cancer. The condition is caused by the hepatitis D virus (HDV).'}, {'Disease': 'Heart attack', 'Description': 'The death of heart muscle due to the loss of blood supply. The loss of blood supply is usually caused by a complete blockage of a coronary artery, one of the arteries that supplies blood to the heart muscle.'}, {'Disease': 'Pneumonia', 'Description': 'Pneumonia is an infection in one or both lungs. Bacteria, viruses, and fungi cause it. The infection causes inflammation in the air sacs in your lungs, which are called alveoli. The alveoli fill with fluid or pus, making it difficult to breathe.'}, {'Disease': 'Arthritis', 'Description': 'Arthritis is the swelling and tenderness of one or more of your joints. The main symptoms of arthritis are joint pain and stiffness, which typically worsen with age. The most common types of arthritis are osteoarthritis and rheumatoid arthritis.'}, {'Disease': 'Gastroenteritis', 'Description': 'Gastroenteritis is an inflammation of the digestive tract, particularly the stomach, and large and small intestines. Viral and bacterial gastroenteritis are intestinal infections associated with symptoms of diarrhea , abdominal cramps, nausea , and vomiting .'}, {'Disease': 'Tuberculosis', 'Description': 'Tuberculosis (TB) is an infectious disease usually caused by Mycobacterium tuberculosis (MTB) bacteria. Tuberculosis generally affects the lungs, but can also affect other parts of the body. Most infections show no symptoms, in which case it is known as latent tuberculosis.'}]

disease_precautions = [{'Disease': 'Drug Reaction', 'Precaution_1': 'stop irritation', 'Precaution_2': 'consult nearest hospital', 'Precaution_3': 'stop taking drug', 'Precaution_4': 'follow up'}, {'Disease': 'Malaria', 'Precaution_1': 'Consult nearest hospital', 'Precaution_2': 'avoid oily food', 'Precaution_3': 'avoid non veg food', 'Precaution_4': 'keep mosquitos out'}, {'Disease': 'Allergy', 'Precaution_1': 'apply calamine', 'Precaution_2': 'cover area with bandage', 'Precaution_3': "nan", 'Precaution_4': 'use ice to compress itching'}, {'Disease': 'Hypothyroidism', 'Precaution_1': 'reduce stress', 'Precaution_2': 'exercise', 'Precaution_3': 'eat healthy', 'Precaution_4': 'get proper sleep'}, {'Disease': 'Psoriasis', 'Precaution_1': 'wash hands with warm soapy water', 'Precaution_2': 'stop bleeding using pressure', 'Precaution_3': 'consult doctor', 'Precaution_4': 'salt baths'}, {'Disease': 'GERD', 'Precaution_1': 'avoid fatty spicy food', 'Precaution_2': 'avoid lying down after eating', 'Precaution_3': 'maintain healthy weight', 'Precaution_4': 'exercise'}, {'Disease': 'Chronic cholestasis', 'Precaution_1': 'cold baths', 'Precaution_2': 'anti itch medicine', 'Precaution_3': 'consult doctor', 'Precaution_4': 'eat healthy'}, {'Disease': 'hepatitis A', 'Precaution_1': 'Consult nearest hospital', 'Precaution_2': 'wash hands through', 'Precaution_3': 'avoid fatty spicy food', 'Precaution_4': 'medication'}, {'Disease': 'Osteoarthristis', 'Precaution_1': 'acetaminophen', 'Precaution_2': 'consult nearest hospital', 'Precaution_3': 'follow up', 'Precaution_4': 'salt baths'}, {'Disease': '(vertigo) Paroymsal  Positional Vertigo', 'Precaution_1': 'lie down', 'Precaution_2': 'avoid sudden change in body', 'Precaution_3': 'avoid abrupt head movment', 'Precaution_4': 'relax'}, {'Disease': 'Hypoglycemia', 'Precaution_1': 'lie down on side', 'Precaution_2': 'check in pulse', 'Precaution_3': 'drink sugary drinks', 'Precaution_4': 'consult doctor'}, {'Disease': 'Acne', 'Precaution_1': 'bath twice', 'Precaution_2': 'avoid fatty spicy food', 'Precaution_3': 'drink plenty of water', 'Precaution_4': 'avoid too many products'}, {'Disease': 'Diabetes ', 'Precaution_1': 'have balanced diet', 'Precaution_2': 'exercise', 'Precaution_3': 'consult doctor', 'Precaution_4': 'follow up'}, {'Disease': 'Impetigo', 'Precaution_1': 'soak affected area in warm water', 'Precaution_2': 'use antibiotics', 'Precaution_3': 'remove scabs with wet compressed cloth', 'Precaution_4': 'consult doctor'}, {'Disease': 'Hypertension ', 'Precaution_1': 'meditation', 'Precaution_2': 'salt baths', 'Precaution_3': 'reduce stress', 'Precaution_4': 'get proper sleep'}, {'Disease': 'Peptic ulcer diseae', 'Precaution_1': 'avoid fatty spicy food', 'Precaution_2': 'consume probiotic food', 'Precaution_3': 'eliminate milk', 'Precaution_4': 'limit alcohol'}, {'Disease': 'Dimorphic hemmorhoids(piles)', 'Precaution_1': 'avoid fatty spicy food', 'Precaution_2': 'consume witch hazel', 'Precaution_3': 'warm bath with epsom salt', 'Precaution_4': 'consume alovera juice'}, {'Disease': 'Common Cold', 'Precaution_1': 'drink vitamin c rich drinks', 'Precaution_2': 'take vapour', 'Precaution_3': 'avoid cold food', 'Precaution_4': 'keep fever in check'}, {'Disease': 'Chicken pox', 'Precaution_1': 'use neem in bathing ', 'Precaution_2': 'consume neem leaves', 'Precaution_3': 'take vaccine', 'Precaution_4': 'avoid public places'}, {'Disease': 'Cervical spondylosis', 'Precaution_1': 'use heating pad or cold pack', 'Precaution_2': 'exercise', 'Precaution_3': 'take otc pain reliver', 'Precaution_4': 'consult doctor'}, {'Disease': 'Hyperthyroidism', 'Precaution_1': 'eat healthy', 'Precaution_2': 'massage', 'Precaution_3': 'use lemon balm', 'Precaution_4': 'take radioactive iodine treatment'}, {'Disease': 'Urinary tract infection', 'Precaution_1': 'drink plenty of water', 'Precaution_2': 'increase vitamin c intake', 'Precaution_3': 'drink cranberry juice', 'Precaution_4': 'take probiotics'}, {'Disease': 'Varicose veins', 'Precaution_1': 'lie down flat and raise the leg high', 'Precaution_2': 'use oinments', 'Precaution_3': 'use vein compression', 'Precaution_4': 'dont stand still for long'}, {'Disease': 'AIDS', 'Precaution_1': 'avoid open cuts', 'Precaution_2': 'wear ppe if possible', 'Precaution_3': 'consult doctor', 'Precaution_4': 'follow up'}, {'Disease': 'Paralysis (brain hemorrhage)', 'Precaution_1': 'massage', 'Precaution_2': 'eat healthy', 'Precaution_3': 'exercise', 'Precaution_4': 'consult doctor'}, {'Disease': 'Typhoid', 'Precaution_1': 'eat high calorie vegitables', 'Precaution_2': 'antiboitic therapy', 'Precaution_3': 'consult doctor', 'Precaution_4': 'medication'}, {'Disease': 'Hepatitis B', 'Precaution_1': 'consult nearest hospital', 'Precaution_2': 'vaccination', 'Precaution_3': 'eat healthy', 'Precaution_4': 'medication'}, {'Disease': 'Fungal infection', 'Precaution_1': 'bath twice', 'Precaution_2': 'use detol or neem in bathing water', 'Precaution_3': 'keep infected area dry', 'Precaution_4': 'use clean cloths'}, {'Disease': 'Hepatitis C', 'Precaution_1': 'Consult nearest hospital', 'Precaution_2': 'vaccination', 'Precaution_3': 'eat healthy', 'Precaution_4': 'medication'}, {'Disease': 'Migraine', 'Precaution_1': 'meditation', 'Precaution_2': 'reduce stress', 'Precaution_3': 'use poloroid glasses in sun', 'Precaution_4': 'consult doctor'}, {'Disease': 'Bronchial Asthma', 'Precaution_1': 'switch to loose cloothing', 'Precaution_2': 'take deep breaths', 'Precaution_3': 'get away from trigger', 'Precaution_4': 'seek help'}, {'Disease': 'Alcoholic hepatitis', 'Precaution_1': 'stop alcohol consumption', 'Precaution_2': 'consult doctor', 'Precaution_3': 'medication', 'Precaution_4': 'follow up'}, {'Disease': 'Jaundice', 'Precaution_1': 'drink plenty of water', 'Precaution_2': 'consume milk thistle', 'Precaution_3': 'eat fruits and high fiberous food', 'Precaution_4': 'medication'}, {'Disease': 'Hepatitis E', 'Precaution_1': 'stop alcohol consumption', 'Precaution_2': 'rest', 'Precaution_3': 'consult doctor', 'Precaution_4': 'medication'}, {'Disease': 'Dengue', 'Precaution_1': 'drink papaya leaf juice', 'Precaution_2': 'avoid fatty spicy food', 'Precaution_3': 'keep mosquitos away', 'Precaution_4': 'keep hydrated'}, {'Disease': 'Hepatitis D', 'Precaution_1': 'consult doctor', 'Precaution_2': 'medication', 'Precaution_3': 'eat healthy', 'Precaution_4': 'follow up'}, {'Disease': 'Heart attack', 'Precaution_1': 'call ambulance', 'Precaution_2': 'chew or swallow asprin', 'Precaution_3': 'keep calm', 'Precaution_4': "nan"}, {'Disease': 'Pneumonia', 'Precaution_1': 'consult doctor', 'Precaution_2': 'medication', 'Precaution_3': 'rest', 'Precaution_4': 'follow up'}, {'Disease': 'Arthritis', 'Precaution_1': 'exercise', 'Precaution_2': 'use hot and cold therapy', 'Precaution_3': 'try acupuncture', 'Precaution_4': 'massage'}, {'Disease': 'Gastroenteritis', 'Precaution_1': 'stop eating solid food for while', 'Precaution_2': 'try taking small sips of water', 'Precaution_3': 'rest', 'Precaution_4': 'ease back into eating'}, {'Disease': 'Tuberculosis', 'Precaution_1': 'cover mouth', 'Precaution_2': 'consult doctor', 'Precaution_3': 'medication', 'Precaution_4': 'rest'}]


diseases_list = [
    "Paroymsal Positional Vertigo", "AIDS", "Acne", "Alcoholic hepatitis",
    "Allergy", "Arthritis", "Bronchial Asthma", "Cervical spondylosis",
    "Chicken pox", "Chronic cholestasis", "Common Cold", "Dengue", "Diabetes",
    "Dimorphic hemmorhoids(piles)", "Drug Reaction", "Fungal infection", "GERD",
    "Gastroenteritis", "Heart attack", "Hepatitis B", "Hepatitis C",
    "Hepatitis D", "Hepatitis E", "Hypertension", "Hyperthyroidism",
    "Hypoglycemia", "Hypothyroidism", "Impetigo", "Jaundice", "Malaria",
    "Migraine", "Osteoarthristis", "Paralysis (brain hemorrhage)",
    "Peptic ulcer diseae", "Pneumonia", "Psoriasis", "Tuberculosis", "Typhoid",
    "Urinary tract infection", "Varicose veins", "hepatitis A"
]

# # Define a custom LSTM layer class
# class CustomLSTM(LSTM):
#     def __init__(self, *args, time_major=False, **kwargs):
#         self.time_major = time_major
#         super(CustomLSTM, self).__init__(*args, **kwargs)

# # Define custom objects dictionary with Orthogonal initializer and CustomLSTM
# custom_objects = {'Orthogonal': Orthogonal, 'CustomLSTM': CustomLSTM}

try:
    path = './models/finaldisease.h5'
    model = load_model(path)
    print('sucess model loaded successfully!!')
except Exception as e:
    print('Error while loading model:')
    print(e)




@app.route('/')
def index():
    return 'hello world'

@app.route('/disease-predict',methods=['POST','GET'])
def disease_predict():
    if request.method == 'POST':
        symptom_list = request.json['symptom_list']
        res = []
        ind = 0
        temp_list = []
        for i in symptoms_list:
            if i not in temp_list and i in symptom_list:
                temp_list.append(i)
                res.append(1)
                ind+=1
            else:
                res.append(0)
                ind+=1
        tp1 = preprocessing.normalize([res])
        scaler = Normalizer().fit(tp1)
        tp1 = scaler.transform(tp1)
        np.set_printoptions(precision=3)
        tp1 = tp1.reshape(tp1.shape[0],1,tp1.shape[1])
        predict_tp1=model.predict(tp1)
        value = diseases_list[np.argmax(predict_tp1)]
        disease_desc = ''
        disease_prec = ''
        for i in disease_description:
            if i['Disease'] == value:
                disease_desc = i['Description']
            else:
                pass
        
        for i in disease_precautions:
            if i['Disease'] == value:
                disease_prec = i
            else:
                pass


        return jsonify({
            "disease":value,
            "disease_description":disease_desc,
            "disease_precautions":disease_prec
        })
    

if __name__ == '__main__': 
    app.run(debug=True)