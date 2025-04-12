import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleDoctor } from '../redux/slices/authSlice';
import { useParams, useLocation } from 'react-router-dom';
import '../styles/DoctorDetails.css';
import { bookAppointment } from '../redux/slices/appointmentSlice';

const symptomsList = [
    "Abdominal Pain", "Acid Reflux", "Acne", "Agitation", "Allergic Reaction", "Anemia", "Anxiety", "Apathy",
    "Appetite Loss", "Arm Pain", "Asthma", "Back Pain", "Bad Breath", "Balance Problems", "Belching", "Bloating",
    "Blood in Stool", "Blurred Vision", "Body Aches", "Bone Pain", "Breast Lumps", "Breathing Difficulty",
    "Burning Sensation", "Chest Pain", "Chills", "Cold Hands", "Cold Feet", "Confusion", "Constipation",
    "Cough", "Dandruff", "Dark Urine", "Dehydration", "Depression", "Diarrhea", "Difficulty Swallowing",
    "Dizziness", "Double Vision", "Dry Mouth", "Dry Skin", "Ear Pain", "Ear Ringing", "Easy Bruising", "Excessive Sweating",
    "Eye Pain", "Fatigue", "Fever", "Flu-like Symptoms", "Frequent Urination", "Gas", "Hair Loss", "Hallucinations",
    "Headache", "Heart Palpitations", "Heartburn", "High Blood Pressure", "Hoarseness", "Hyperactivity",
    "Hypersensitivity to Light", "Impaired Speech", "Inability to Concentrate", "Indigestion", "Insomnia",
    "Irregular Heartbeat", "Itching", "Joint Pain", "Kidney Pain", "Knee Pain", "Lethargy", "Light Sensitivity",
    "Low Blood Pressure", "Memory Loss", "Menstrual Cramps", "Migraine", "Mood Swings", "Muscle Cramps",
    "Muscle Pain", "Nausea", "Neck Pain", "Nerve Pain", "Nervousness", "Night Sweats", "Numbness", "Obesity",
    "Pale Skin", "Palpitations", "Persistent Cough", "Postnasal Drip", "Rash", "Red Eyes", "Restlessness",
    "Runny Nose", "Seizures", "Shakiness", "Shortness of Breath", "Skin Peeling", "Skin Rashes", "Sleep Apnea",
    "Sleep Disturbances", "Sneezing", "Sore Throat", "Stiff Joints", "Stomach Pain", "Sudden Weight Loss",
    "Sweating", "Swelling", "Swollen Lymph Nodes", "Tingling Sensation", "Tooth Pain", "Tremors", "Unsteady Gait",
    "Urinary Tract Infection", "Vertigo", "Vomiting", "Watery Eyes", "Weakness", "Weight Gain", "Wheezing",
    "Abnormal Heartbeat", "Achilles Tendon Pain", "Acoustic Neuroma Symptoms", "Acroparesthesia", "Actinic Keratosis",
    "Addison's Disease Symptoms", "Adrenal Fatigue", "Ageusia", "Air Hunger", "Alcohol Intolerance",
    "Allodynia", "Alopecia Areata", "Amnesia", "Anal Itching", "Angioedema", "Anhidrosis", "Ankle Swelling",
    "Anterior Knee Pain", "Aphasia", "Apraxia", "Areflexia", "Arthritis", "Asperger’s Symptoms",
    "Ataxia", "Atrial Fibrillation Symptoms", "Auditory Hallucinations", "Autoimmune Disorder Symptoms",
    "Balance Disorders", "Barrett's Esophagus Symptoms", "Basilic Vein Thrombosis", "Bell's Palsy Symptoms",
    "Biceps Tendonitis", "Biliary Colic", "Blepharitis", "Bloating After Eating", "Bloodshot Eyes",
    "Body Temperature Dysregulation", "Bone Spurs", "Brain Fog", "Bronchiectasis Symptoms", "Burning Feet Syndrome",
    "Canker Sores", "Carpal Tunnel Syndrome", "Celiac Disease Symptoms", "Cellulitis Symptoms", "Cervical Dystonia",
    "Chronic Fatigue Syndrome", "Chronic Sinusitis", "Claudication", "Cluster Headaches", "Cold Sores",
    "Collapsed Lung Symptoms", "Color Blindness", "Complex Regional Pain Syndrome", "Congestive Heart Failure Symptoms",
    "COPD Symptoms", "Corneal Abrasion", "Costochondritis", "Cyanosis", "Cystitis Symptoms", "Decreased Reflexes",
    "Dermatitis", "Dermatographia", "Diabetic Neuropathy", "Difficulty Breathing While Lying Down", "Diverticulitis Symptoms",
    "Double Chin", "Dry Cough", "Dry Eye Syndrome", "Dysautonomia", "Dysgeusia", "Dyslexia", "Dysphagia", "Ear Fullness",
    "Edema", "Electrolyte Imbalance Symptoms", "Emphysema Symptoms", "Endometriosis Symptoms", "Epigastric Pain",
    "Epilepsy Symptoms", "Esophageal Spasm", "Eustachian Tube Dysfunction", "Eye Floaters", "Eye Twitching",
    "Facial Flushing", "Facial Paralysis", "Facial Swelling", "Fainting Spells", "Fasciculations", "Fibrocystic Breast Disease",
    "Flatulence", "Fluctuating Blood Pressure", "Food Intolerance Symptoms", "Frontal Headache", "Frozen Shoulder",
    "Gallbladder Pain", "Ganglion Cyst", "Gastroparesis", "Generalized Anxiety Disorder Symptoms", "GERD Symptoms",
    "Goiter", "Gout Symptoms", "Graves’ Disease Symptoms", "Groin Pain", "Guillain-Barré Syndrome Symptoms",
    "Hair Thinning", "Hearing Loss", "Heart Murmur", "Heel Pain", "Hematuria", "Hemorrhoids", "Hepatitis Symptoms",
    "Hiccups", "High Cholesterol Symptoms", "Hirsutism", "HIV Symptoms", "Hodgkin’s Lymphoma Symptoms",
    "Hot Flashes", "Hypercalcemia Symptoms", "Hyperhidrosis", "Hyperkalemia Symptoms", "Hypersomnia",
    "Hypoglycemia Symptoms", "Hypogonadism", "Hypokalemia Symptoms", "Hypothyroidism Symptoms", "Idiopathic Hypersomnia",
    "Immune System Dysfunction", "Impotence", "Incontinence", "Inflamed Gums", "Influenza Symptoms",
    "Inner Ear Infection Symptoms", "Interstitial Cystitis Symptoms", "Iron Deficiency Symptoms", "Itchy Palms",
    "Jaw Clenching", "Jaw Pain", "Jaundice", "Joint Swelling", "Kidney Failure Symptoms", "Lactose Intolerance Symptoms",
    "Laryngitis Symptoms", "Lichen Planus", "Lichen Sclerosus", "Lip Swelling", "Liver Disease Symptoms", "Lockjaw",
    "Low Back Pain", "Lump in Throat Sensation", "Lung Inflammation Symptoms", "Lymphedema", "Lymphoma Symptoms",
    "Macular Degeneration Symptoms", "Mastalgia", "Mastoiditis Symptoms", "Meniere’s Disease Symptoms", "Menopause Symptoms",
    "Menorrhagia", "Metabolic Syndrome Symptoms", "Mitral Valve Prolapse Symptoms", "Morning Stiffness",
    "Multiple Sclerosis Symptoms", "Myasthenia Gravis Symptoms", "Nasal Congestion", "Nasal Drip", "Neck Stiffness",
    "Neuralgia", "Neuropathy", "Night Blindness", "Nightmares", "Nodule on Thyroid", "Nosebleeds", "Obsessive-Compulsive Disorder Symptoms",
    "Occipital Neuralgia", "Oral Thrush", "Osteoarthritis Symptoms", "Osteomalacia Symptoms", "Osteomyelitis Symptoms",
    "Osteoporosis Symptoms", "Otitis Externa", "Overactive Bladder Symptoms", "Paget’s Disease Symptoms",
    "Panic Disorder Symptoms", "Paralysis", "Paranoia", "Parathyroid Disease Symptoms", "Parkinson’s Disease Symptoms",
    "Pelvic Pain", "Peptic Ulcer Symptoms", "Pericarditis Symptoms", "Peripheral Neuropathy Symptoms", "Phantom Limb Pain",
    "Pharyngitis Symptoms", "Pink Eye", "Pitting Edema", "Polymyalgia Rheumatica Symptoms", "Postnasal Drip",
    "Psoriasis Symptoms", "Pulmonary Edema Symptoms", "Raynaud’s Disease Symptoms", "Reactive Hypoglycemia",
    "Restless Legs Syndrome Symptoms", "Retinal Detachment Symptoms", "Reynaud’s Syndrome Symptoms", "Rheumatoid Arthritis Symptoms",
    "Rotator Cuff Injury Symptoms", "Scalp Psoriasis", "Sciatica Symptoms", "Seasonal Allergies Symptoms",
    "Seborrheic Dermatitis", "Shingles Symptoms", "Sinus Pressure", "Sjogren’s Syndrome Symptoms", "Skin Discoloration",
    "Sleep Deprivation Symptoms", "Sleep Paralysis", "Small Fiber Neuropathy", "Spinal Stenosis Symptoms",
    "Spleen Pain", "Stiff Neck", "Stomach Bloating", "Stomach Burning", "Subconjunctival Hemorrhage",
    "Swollen Hands", "Swollen Legs", "Swollen Uvula", "Tachycardia Symptoms", "Tailbone Pain", "Tendonitis Symptoms",
    "Thyroid Disease Symptoms", "Tinnitus", "Tonsillitis Symptoms", "Trigeminal Neuralgia Symptoms", "Ulcerative Colitis Symptoms",
    "Underactive Thyroid Symptoms", "Urethritis Symptoms", "Urinary Frequency", "Varicose Veins Symptoms",
    "Vitamin Deficiency Symptoms", "Vocal Cord Dysfunction Symptoms", "Von Willebrand Disease Symptoms", "Wrist Pain",
    "Yellow Eyes", "Zinc Deficiency Symptoms", "Zoster Symptoms",
    "Abdominal Distension", "Acne Vulgaris", "Acute Bronchitis Symptoms", "Acute Cholecystitis Symptoms",
    "Acute Kidney Injury Symptoms", "Acute Lymphoblastic Leukemia Symptoms", "Acute Myeloid Leukemia Symptoms",
    "Acute Pancreatitis Symptoms", "Acute Sinusitis Symptoms", "Acute Stress Disorder Symptoms",
    "Acute Tubular Necrosis Symptoms", "Addisonian Crisis Symptoms", "Adrenal Crisis Symptoms",
    "Adrenal Insufficiency Symptoms", "Agranulocytosis Symptoms", "Alcoholic Hepatitis Symptoms",
    "Alcoholism Symptoms",  "Allergic Rhinitis Symptoms", "Alzheimer’s Disease Symptoms",
    "Amyloidosis Symptoms", "Anaphylaxis Symptoms", "Anemia of Chronic Disease Symptoms",
    "Anxiety Disorders Symptoms",
    "Aortic Aneurysm Symptoms", "Aortic Dissection Symptoms", "Aortic Stenosis Symptoms",
    "Aphthous Stomatitis",
    "Appendicitis Symptoms", "Arterial Insufficiency Symptoms", "Arthralgia", "Arthritis Symptoms",
    "Asbestosis Symptoms",
    "Asthma Symptoms", "Atopic Dermatitis Symptoms", "Atrial Flutter Symptoms",
    "Atrial Septal Defect Symptoms", 
    "पोटदुखी", "आम्लपित्त", "मुरुम", "अस्वस्थता", "ऍलर्जी प्रतिक्रिया", "रक्तअल्पता", "चिंता", 
    "अनुत्साह", "भूक कमी होणे", "हातदुखी", "दमा", "पाठदुखी", "दुर्गंधी", "समतोल बिघडणे", 
    "ढेकर येणे", "पोटफुगी", "मलात रक्त", "धूसर दृष्टी", "अंगदुखी", "हाडदुखी", "स्तनाच्या गाठी", 
    "श्वास घेण्यास त्रास", "जळजळ", "छातीदुखी", "थंडी वाजणे", "थंड हात", "थंड पाय", "गोंधळ", 
    "बद्धकोष्ठता", "खोकला", "कोंडा", "गडद लघवी", "पाणी कमी होणे", "नैराश्य", "अतिसार", 
    "गिळताना त्रास", "भोवळ", "दुहेरी दृष्टी", "कोरडे तोंड", "कोरडी त्वचा", "कानदुखी", "कानात गूंज", 
    "सहज दुखापत होणे", "जास्त घाम येणे", "डोळेदुखी", "थकवा", "ताप", "फ्लू सारखी लक्षणे", 
    "वारंवार लघवी", "गॅस", "केस गळणे", "भ्रम", "डोकेदुखी", "हृदयाची धडधड", "हृदय जळजळ", 
    "उच्च रक्तदाब", "घसा बसणे", "अति सक्रियता", "प्रकाशास तीव्र संवेदनशीलता", "भाषणास अडचण", 
    "एकाग्रता कमी होणे", "अपचन", "अनिद्रा", "अनियमित हृदयस्पंदन", "खाज येणे", "सांधेदुखी", 
    "मूत्रपिंडदुखी", "गुडघेदुखी", "सुस्ती", "प्रकाश संवेदनशीलता", "निम्न रक्तदाब", "स्मृती कमी होणे", 
    "मासिक पाळीचे वेदना", "मायग्रेन", "मूड स्विंग्स", "स्नायूंचे आकुंचन", "स्नायूदुखी", "मळमळ", "मानदुखी",
    "मज्जासंस्थेतील वेदना", "चिंता", "रात्री घाम येणे", "बधीरता", "लठ्ठपणा", "फिकट त्वचा", 
    "हृदयाची अनियमित धडधड", "सतत खोकला", "नाकातून जळजळ", "पुरळ", "लालसर डोळे", 
    "अस्वस्थता", "नाक वाहणे", "झटके", "कंपने", "श्वास गुदमरला जाणे", "त्वचा सोलणे", "त्वचेवर पुरळ", 
    "झोपेचे विकार", "शिंकणे", "घश्यात वेदना", "जखडलेले सांधे", "पोटदुखी", "अचानक वजन कमी होणे", 
    "घाम येणे", "सूज येणे", "लसीका ग्रंथी सूजणे", "चुंबकासारखे संवेदना", "दातदुखी", "हात कंपवणे", 
    "अस्थिर चालणे", "मूत्र मार्गातील संसर्ग", "चक्कर", "उलटी", "पाण्याने भरलेले डोळे", "दुर्बलता", 
    "वजन वाढणे", "घरघर",
    "पेट दर्द", "एसिडिटी", "मुंहासे", "बेचैनी", "एलर्जी प्रतिक्रिया", "एनीमिया", "चिंता", 
    "उदासीनता", "भूख की कमी", "हाथ दर्द", "अस्थमा", "पीठ दर्द", "मुंह से बदबू", "संतुलन की समस्या",
     "डकार आना", "पेट फूलना", "मल में खून", "धुंधली दृष्टि", "शरीर में दर्द", "हड्डियों में दर्द", 
     "स्तनों में गांठें", "सांस लेने में दिक्कत", "जलन महसूस होना", "सीने में दर्द", "सिहरन", "ठंडे हाथ",
      "ठंडे पैर", "भ्रम", "कब्ज", "खांसी", "रूसी", "गहरे रंग का पेशाब", "शरीर में पानी की कमी", 
      "अवसाद", "दस्त", "निगलने में कठिनाई", "चक्कर आना", "दोहरी दृष्टि", "सूखा मुंह", "सूखी त्वचा", 
      "कान दर्द", "कानों में बजना", "आसानी से चोट लगना", "अत्यधिक पसीना आना", "आंखों में दर्द",
       "थकान", "बुखार", "फ्लू जैसे लक्षण", "बार-बार पेशाब आना", "गैस", "बाल झड़ना", "मतिभ्रम",
        "सिरदर्द", "हृदय गति तेज होना", "सीने में जलन", "उच्च रक्तचाप", "आवाज़ बैठना",
         "अत्यधिक सक्रियता", "तेज रोशनी से संवेदनशीलता", "बोलने में कठिनाई", "ध्यान केंद्रित करने में कठिनाई", 
         "पाचन खराब होना", "अनिद्रा", "अनियमित हृदय गति", "खुजली", "जोड़ों में दर्द", "गुर्दे में दर्द", 
         "घुटनों में दर्द", "सुस्ती", "प्रकाश संवेदनशीलता", "निम्न रक्तचाप", "याददाश्त कमजोर होना", 
         "मासिक धर्म में दर्द", "माइग्रेन", "मिजाज बदलना", "मांसपेशियों में ऐंठन", "मांसपेशियों में दर्द", 
         "जी मिचलाना", "गर्दन में दर्द", "नसों में दर्द", "घबराहट", "रात को अधिक पसीना आना", "सुन्नपन", 
         "मोटापा", "फीकी त्वचा", "अनियमित हृदय धड़कन", "लगातार खांसी", "नाक में जलन", "चकत्ते", 
         "लाल आंखें", "बेचैनी", "बहता हुआ नाक", "दौरे पड़ना", "कांपना", "सांस लेने में तकलीफ", 
         "त्वचा का छिलना", "त्वचा पर दाने", "नींद की समस्या", "छींक आना", "गले में खराश", "कड़े जोड़", 
         "पेट दर्द", "अचानक वजन घटना", "पसीना आना", "सूजन आना", "लसिका ग्रंथियों की सूजन", 
         "झुनझुनी महसूस होना", "दांत दर्द", "कांपना", "लड़खड़ाकर चलना", "मूत्र संक्रमण", "चक्कर आना", 
         "उल्टी आना", "आंसू बहना", "कमजोरी", "वजन बढ़ना", "घरघराहट" , "पेट में दर्द", "दाने",
    "तेज बुखार", "खांसी", "गले में खराश", "सिरदर्द", "कमजोरी", "सांस लेने में दिक्कत", 
    "पेट में ऐंठन", "बदहज़मी", "उल्टी", "दस्त", "छाती में दर्द", "पेशाब में जलन",
    "पेशाब में खून", "गर्दन में दर्द", "कमर में दर्द", "घुटने में दर्द", "हाथों में सुन्नपन",
];

const DoctorDetails = () => {
    const { doctorId } = useParams(); // Get doctorId from the URL
    const location = useLocation(); // Get state passed from BookAppointment.js
    const dispatch = useDispatch();
    const { priority_score } = useSelector((state) => state.appointments);
    const { doctor, loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        symptoms: location.state?.symptoms || '',
        language: location.state?.language || '',
        timeSlot: location.state?.timeSlot || '',
    });

    const [suggestions, setSuggestions] = useState([]);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    useEffect(() => {
        // Fetch doctor details when the component loads
        dispatch(fetchSingleDoctor({ doctorId }));
    }, [dispatch, doctorId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSymptomsChange = (e) => {
        const value = e.target.value;
        setFormData({
            ...formData,
            symptoms: value,
        });

        const lastEntry = value.split(",").pop().trim(); // Get last typed word
        if (lastEntry) {
            const filteredSuggestions = symptomsList.filter((symptom) =>
                symptom.toLowerCase().startsWith(lastEntry.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
        setFocusedIndex(-1); // Reset focus when typing
    };

    const handleSelect = (symptom) => {
        const entries = formData.symptoms.split(",").map((s) => s.trim());
        entries[entries.length - 1] = symptom; // Replace last incomplete entry
        setFormData({
            ...formData,
            symptoms: entries.join(", ") + ", ",
        });
        setSuggestions([]); // Clear suggestions after selection
    };

    const handleKeyDown = (e) => {
        if (suggestions.length > 0) {
            if (e.key === "ArrowDown") {
                // Move focus down
                setFocusedIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
            } else if (e.key === "ArrowUp") {
                // Move focus up
                setFocusedIndex((prevIndex) => (prevIndex - 1 + suggestions.length) % suggestions.length);
            } else if (e.key === "Enter" && focusedIndex >= 0) {
                // Select the focused suggestion
                handleSelect(suggestions[focusedIndex]);
                e.preventDefault(); // Prevent form submission
            }
        }
    };

    const handleBookAppointment = () => {
        dispatch(
            bookAppointment({
                doctorId,
                symptoms: formData.symptoms,
                timeSlot: formData.timeSlot,
                priority_score,
                language: formData.language,
            })
        )
            .unwrap()
            .then(() => {
                alert('Appointment Query Raised successfully!');
            })
            .catch((err) => {
                alert('Failed to book appointment:', err);
            });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="doctor-details-container">
            {doctor ? (
                <div>
                    <div className="doctor-details-card">
                        <img
                            src={doctor.profile_image}
                            alt={`${doctor.name}'s profile`}
                            className="doctor-profile-image"
                        />
                        <div className="doctor-basic-info">
                            <h2>{doctor.name}</h2>
                            <p className="doctor-email">{doctor.email}</p>
                        </div>
                        <table className="doctor-details-table">
                            <tbody>
                                <tr>
                                    <td><strong>Specialization:</strong></td>
                                    <td>{doctor.specialist}</td>
                                </tr>
                                <tr>
                                    <td><strong>Specialist Degree:</strong></td>
                                    <td>{doctor.specialistDegree}</td>
                                </tr>
                                <tr>
                                    <td><strong>Languages:</strong></td>
                                    <td>{doctor.language.join(', ')}</td>
                                </tr>
                                <tr>
                                    <td><strong>Phone:</strong></td>
                                    <td>{doctor.phone}</td>
                                </tr>
                                <tr>
                                    <td><strong>Years of Experience:</strong></td>
                                    <td>{doctor.years_of_experience}</td>
                                </tr>
                                <tr>
                                    <td><strong>Medical Registration ID:</strong></td>
                                    <td>{doctor.medical_registration_id}</td>
                                </tr>
                                <tr>
                                    <td><strong>Address:</strong></td>
                                    <td>{doctor.address || 'Not provided'}</td>
                                </tr>
                                <tr>
                                    <td><strong>Rating:</strong></td>
                                    <td>{doctor.rating.toFixed(1)} ({doctor.rating_count} reviews)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="booking-form">
                        <h3>Book Appointment</h3>
                        <div className="form-group relative">
                            <label htmlFor="symptoms">Symptoms</label>
                            <textarea
                                id="symptoms"
                                name="symptoms"
                                value={formData.symptoms}
                                onChange={handleSymptomsChange}
                                onKeyDown={handleKeyDown} // Add keyboard event listener
                                placeholder="Describe your symptoms"
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            {suggestions.length > 0 && (
                                <ul className="suggestions-dropdown">
                                    {suggestions.map((symptom, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSelect(symptom)}
                                            className={`p-2 cursor-pointer ${
                                                index === focusedIndex ? "focused" : ""
                                            }`}
                                        >
                                            {symptom}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="timeSlot">Time Slot</label>
                            <select
                                id="timeSlot"
                                name="timeSlot"
                                value={formData.timeSlot}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">Select Time Slot</option>
                                {doctor.time_slot[0] === 1 && new Date().getTime() < new Date().setHours(2, 30, 0, 0) ? (
                                    <option value="0">0:00 - 3:00</option>
                                ) : null}
                                {doctor.time_slot[1] === 1 && new Date().getTime() < new Date().setHours(5, 30, 0, 0) ? (
                                    <option value="1">3:00 - 6:00</option>
                                ) : null}
                                {doctor.time_slot[2] === 1 && new Date().getTime() < new Date().setHours(8, 30, 0, 0) ? (
                                    <option value="2">6:00 - 9:00</option>
                                ) : null}
                                {doctor.time_slot[3] === 1 && new Date().getTime() < new Date().setHours(11, 30, 0, 0) ? (
                                    <option value="3">9:00 - 12:00</option>
                                ) : null}
                                {doctor.time_slot[4] === 1 && new Date().getTime() < new Date().setHours(14, 30, 0, 0) ? (
                                    <option value="4">12:00 - 15:00</option>
                                ) : null}
                                {doctor.time_slot[5] === 1 && new Date().getTime() < new Date().setHours(17, 30, 0, 0) ? (
                                    <option value="5">15:00 - 18:00</option>
                                ) : null}
                                {doctor.time_slot[6] === 1 && new Date().getTime() < new Date().setHours(20, 30, 0, 0) ? (
                                    <option value="6">18:00 - 21:00</option>
                                ) : null}
                                {doctor.time_slot[7] === 1 && new Date().getTime() < new Date().setHours(23, 30, 0, 0) ? (
                                    <option value="7">21:00 - 24:00</option>
                                ) : null}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="language">Preferred Language</label>
                            <select
                                id="language"
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value="">Select Language</option>
                                <option value="en">English</option>
                                <option value="mr">Marathi</option>
                                <option value="hi">Hindi</option>
                            </select>
                        </div>
                        <button onClick={handleBookAppointment} className="book-button">
                            Book Appointment
                        </button>
                    </div>
                </div>
            ) : (
                <p>No doctor details available.</p>
            )}
        </div>
    );
};

export default DoctorDetails;