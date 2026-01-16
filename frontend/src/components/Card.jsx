import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Card.css';

const Card = ({ title, children, className = '', delay = 0 }) => {
  return (
    <motion.div 
      className={`glass-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
